
import os
import copy


host_persist_dir = os.getcwd() + "/persist"

class VolumeManager:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        if self.base_dir[-1] == "/":
            self.base_dir = self.base_dir[:-1]
        if not os.path.exists(base_dir):
            os.mkdir(base_dir)
        return

    def key2path(self, keylist):
        path = self.base_dir
        for key in keylist:
            path += "/" + key
        return path

    def key_exists(self, keylist):
        path = self.key2path(keylist)
        return os.path.isdir(path) and os.path.exists(path)

    def isdir(self, keylist):
        path = self.key2path(keylist)
        return os.path.isdir(path)

    def filekey2path(self, key, dataname):
        return self.key2path(key) + "/" + dataname

    def data_exists(self, key, dataname):
        path = self.filekey2path(key, dataname)
        return os.path.exists(path)

    def make_key(self, keylist_input, base_input=None):
        keylist = copy.copy(keylist_input)
        if base_input is None:
            base = []
        else:
            base = copy.copy(base_input)
        if not isinstance(keylist, list):
            keylist = [keylist]
        if self.key_exists(base + keylist):
            return
        if self.key_exists(base + keylist[:1]):
            self.make_key(keylist[1:], base + keylist[0])
        current_list = base
        for key in keylist:
            current_list.append(key)
            os.mkdir(self.key2path(current_list))
        return

    def remove_data(self, key, dataname):
        fpath = self.filekey2path(key, dataname)
        os.remove(fpath)
        return

    def remove_dir(self, base_keys, key):
        path = self.key2path(base_keys + [key])
        os.rmdir(path)
        return

    def datanames_in_key(self, keylist):
        if self.key_exists(keylist):
            path = self.key2path(keylist)
            if os.path.isdir(path):
                return os.listdir(path)
        return None

    def get_dir_object(self, keylist):
        if not isinstance(keylist, list):
            keylist = [keylist]
        if not self.key_exists(keylist):
            self.make_key(keylist)
        return VolumeDir(keylist, self)

    def set_data(self, key, dataname, data):
        if not self.key_exists(key):
            self.make_key(key)
        fpath = self.filekey2path(key, dataname)
        if self.data_exists(key, dataname):
            self.remove_data(key, dataname)
        fobject = open(fpath, "w")
        fobject.write(data)
        fobject.close()

    def get_data(self, key, dataname):
        if not self.data_exists(key, dataname):
            result = None
        else:
            fobject = open(self.filekey2path(key, dataname), "r")
            result = fobject.read()
            fobject.close()
        return result

    @property
    def root(self):
        return VolumeDir([], self)

    def __getitem__(self, key_dataname):
        if self.key_exists([key_dataname]):
            return VolumeDir([key_dataname], self)
        elif self.data_exists([], key_dataname):
            return DataObject([], key_dataname, self)
        else:
            return self.get_dir_object([key_dataname])

    def delete_all_contents(self):
        self.root.delete_all_contents()
        return

class VolumeDir:
    def __init__(self, keylist, vmanager):
        self.__dict__["keylist"] = keylist
        self.__dict__["vmanager"] = vmanager

    def do_get(self, key_dataname):
        if self.vmanager.key_exists(self.keylist + [key_dataname]):
            return VolumeDir(self.keylist + [key_dataname], self.vmanager)
        elif self.vmanager.data_exists(self.keylist, key_dataname):
            return DataObject(self.keylist, key_dataname, self.vmanager)
        else:
            return None

    def __getitem__(self, key_dataname):
        return self.do_get(key_dataname)

    def __getattr__(self, key_dataname):
        return self.do_get(key_dataname)

    def __setattr__(self, dataname, data):
        return self.__setitem__(dataname, data)

    def __setitem__(self, dataname, data):
        self.vmanager.set_data(self.keylist, dataname, data)
        return

    def __delitem__(self, key_or_dataname):
        if self.isdir(key_or_dataname):
            dobject = self.vmanager.get_dir_object(self.keylist + [key_or_dataname])
            dobject.delete_all_contents()
            self.vmanager.remove_dir(self.keylist, key_or_dataname)
        else:
            self.vmanager.remove_data(self.keylist, key_or_dataname)
        return

    def isdir(self, key):
        return self.vmanager.isdir(self.keylist + [key])

    def keys(self):
        return self.vmanager.datanames_in_key(self.keylist)

    def add_key(self, key):
        self.vmanager.make_key(key, self.keylist)
        return

    def add_keys(self, keys):
        for key in keys:
            self.vmanager.make_key(key, self.keylist)
        return

    def delete_all_contents(self):
        allnames = self.keys()
        for name in allnames:
            if self.isdir(name):
                self[name].delete_all_contents()
                self.vmanager.remove_dir(self.keylist, name)
            else:
                self.vmanager.remove_data(self.keylist, name)
        return

    def __repr__(self):
        return "volume dir with keylist {}".format(str(self.keylist))

class DataObject:
    def __init__(self, keylist, dataname, vmanager):
        self.keylist = keylist
        self.dataname = dataname
        self.vmanager = vmanager

    @property
    def value(self):
        return self.vmanager.get_data(self.keylist, self.dataname)




