import re
from collections import OrderedDict

import ast
from collections import OrderedDict


indent_unit = "    "


def remove_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n" + total_indent, "\n", the_str)
    result = re.sub(r"^" + total_indent, "", result)
    return result


def insert_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n", r"\n" + total_indent, the_str)
    result = total_indent + result
    return result


class TileParser(object):
    def __init__(self, module_code):
        self.module_code = module_code
        self.module_lines = self.module_code.splitlines()
        self.cnode = self.get_class_node()
        self.class_name = self.cnode.name
        self.base_classes = self.get_base_classes()
        self.is_mpl = "MplFigure" in self.base_classes
        self.is_d3 = "D3Tile" in self.base_classes
        self.methods = self.get_methods()
        self.assignments = self.get_assignments()
        self.defaults = self.extract_defaults()
        self.exports = self.get_exports()
        self.type = self.extract_type()
        self.options = self.get_options_dict()
        self.extra_methods = self.get_extra_methods()

    def reparse(self, new_module_code):
        self.module_code = new_module_code
        self.module_lines = self.module_code.splitlines()
        self.cnode = self.get_class_node()
        self.class_name = self.cnode.name
        self.base_classes = self.get_base_classes()
        self.is_mpl = "MplFigure" in self.base_classes
        self.is_d3 = "D3Tile" in self.base_classes
        self.methods = self.get_methods()
        self.assignments = self.get_assignments()
        self.defaults = self.extract_defaults()
        self.exports = self.get_exports()
        self.type = self.extract_type()
        self.extra_methods = self.get_extra_methods()

    def get_extra_methods(self):
        extra_methods = OrderedDict()
        for k, entry in self.methods.items():
            if k not in ["__init__", "render_content", "options"]:
                if self.is_mpl and k == "draw_plot":
                    continue
                extra_methods[k] = entry
        return extra_methods

    def get_extra_methods_string(self):
        new_code = ""
        first = True
        for k, entry in self.extra_methods.items():
            if first:
                new_code = entry["method_code"]
                first = False
            else:
                new_code += "\n" + entry["method_code"]
        return new_code

    def get_options_dict(self):
        opt_code = self.methods["options"]["method_code_no_decs"]
        opt_code = remove_indents(opt_code, 1)
        exec opt_code
        return options(None)

    def get_class_node(self):
        res = ast.parse(self.module_code)
        for node in res.body:
            if isinstance(node, ast.ClassDef):
                if "user_tile" in self.get_decorators(node):
                    return node
        return None

    def get_decorators(self, cnode):
        dlist = []
        for d in cnode.decorator_list:
            dlist.append(d.id)
        return dlist

    def get_base_classes(self):
        base_classes = []
        for b in self.cnode.bases:
            base_classes.append(b.id)
        return base_classes

    @property
    def category(self):
        if "category" in self.assignments:
            return self.assignments["category"]["value"]
        else:
            return None

    def get_methods(self):
        mdict = OrderedDict()
        last_element = len(self.cnode.body) - 1
        for i, node in enumerate(self.cnode.body):
            if isinstance(node, ast.FunctionDef):
                mdict[node.name] = {"node": node,
                                    "start_line": node.lineno - 1,
                                    "body_start": node.body[0].lineno - 1}
                if i < last_element:
                    mdict[node.name]["last_line"] = self.cnode.body[i + 1].lineno - 2
                else:
                    mdict[node.name]["last_line"] = None
        for i, method_name in enumerate(mdict.keys()[:-1]):
            md = mdict[method_name]
            md["method_code"] = "\n".join(self.module_lines[md["start_line"]:md["last_line"] + 1])
            md["method_body"] = "\n".join(self.module_lines[md["body_start"]:md["last_line"] + 1])
            md["method_code_no_decs"] = "\n".join(self.module_lines[md["start_line"] +
                                                                    len(md["node"].decorator_list):md["last_line"] + 1])
        last_method = mdict.keys()[-1]
        mdict[last_method]["method_code"] = "\n".join(self.module_lines[mdict[last_method]["start_line"]:])
        mdict[last_method]["method_body"] = "\n".join(self.module_lines[mdict[last_method]["body_start"]:])
        mdict[last_method]["method_code_no_decs"] = "\n".join(self.module_lines[mdict[last_method]["start_line"] +
                                                                                len(mdict[last_method]["node"].decorator_list):])
        return mdict

    def get_starting_line(self, method_name):
        if method_name in self.methods:
            return self.methods[method_name]["start_line"] + 1
        else:
            return None

    def rebuild_in_canonical_form(self):
        new_code = "@user_tile\n"
        base_string = self.base_classes[0]
        for bc in self.base_classes[1:]:
            base_string += ", " + bc
        new_code += "class {}({}):".format(self.class_name, base_string)
        for k, entry in self.assignments.items():
            new_code += "\n" + entry["assign_code"]
        new_code += "\n" + self.methods["__init__"]["method_code"]
        new_code += "\n" + self.methods["options"]["method_code"]
        for k, entry in self.methods.items():
            if k not in ["__init__", "options", "render_content", "draw_plot"]:
                new_code += "\n" + entry["method_code"]
        if "draw_plot" in self.methods:
            new_code += "\n" + self.methods["draw_plot"]["method_code"]
        if "render_content" in self.methods:
            new_code += "\n" + self.methods["render_content"]["method_code"]
        return new_code

    def get_assignments(self):
        cnode = self.cnode
        module_lines = self.module_lines
        adict = OrderedDict()
        last_element = len(cnode.body) - 1
        for i, al in enumerate(cnode.body):
            if not isinstance(al, ast.Assign):
                continue
            target = al.targets[0]
            val = al.value
            adict[target.id] = {"node": al, "start_line": al.lineno - 1}
            if i < last_element:
                adict[target.id]["last_line"] = cnode.body[i + 1].lineno - 2
            else:
                adict[target.id]["last_line"] = None
            if isinstance(val, ast.Num):
                adict[target.id]["value"] = val.n
            elif isinstance(val, ast.Str):
                adict[target.id]["value"] = val.s
            elif isinstance(val, ast.Name):
                adict[target.id]["value"] = val.id
                if adict[target.id]["value"] == "None":
                    adict[target.id] = None
            adict[target.id]["assign_code"] = "\n".join(module_lines[adict[target.id]["start_line"]:adict[target.id]["last_line"] + 1])
        return adict

    def extract_defaults(self):
        inode = self.methods["__init__"]["node"]
        adict = OrderedDict()
        for al in inode.body:
            if not isinstance(al, ast.Assign):
                continue
            target = al.targets[0]
            if not isinstance(target, ast.Attribute):
                continue
            if target.attr == "save_attrs":
                continue
            val = al.value
            if isinstance(val, ast.Num):
                adict[target.attr] = val.n
            elif isinstance(val, ast.Str):
                adict[target.attr] = val.s
            elif isinstance(val, ast.Name):
                adict[target.attr] = val.id
                if adict[target.attr] == "None":
                    adict[target.attr] = None
        return adict

    def get_exports(self):
        if "exports" not in self.assignments:
            return None
        enode = self.assignments["exports"]["node"]
        val = enode.value
        export_info = []
        if len(val.elts) == 0:
            return export_info
        if isinstance(val.elts[0], ast.Str):  # legacy handling for all form of exports
            for d in val.elts:
                export_info.append({"name": d.s, "tags": ""})
        else:
            for d in val.elts:
                keylist = []
                for keynode in d.keys:
                    keylist.append(keynode.s)
                vallist = []
                for valnode in d.values:
                    vallist.append(valnode.s)
                edict = {}
                for i in range(len(keylist)):
                    edict[keylist[i]] = vallist[i]
                export_info.append(edict)
        return export_info

    def extract_type(self):
        try:
            if "MplFigure" in self.base_classes:
                return "matplotlib"
            elif "D3Tile" in self.base_classes:
                return "d3"
            else:
                return "standard"
        except:
            return "unknown"
