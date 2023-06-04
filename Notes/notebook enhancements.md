# Notebook enhancements

## Copy and paste cells

#### Next steps here
- [x] There are some general problems with logitems. Can't delete, close, etc.
- [x] add icons to the context menu
- [x] add other functions
- [x] make it work for all types of cells

#### copy
* create toolbar button
* create function that posts modeled on
```javascript
_consoleToNotebook() {
        const result_dict = {
            "main_id": window.main_id,
            "console_items": this.props.console_items,
            "user_id": window.user_id,
        };
        postWithCallback(window.main_id, "console_to_notebook", result_dict)
    }
```

* create handler on python side

```python
    @task_worthy
    def console_to_notebook(self, data_dict):
        self.show_main_status_message("compiling save dictionary")

        def got_save_dict(console_dict):
            console_dict["doc_type"] = "notebook"
            console_dict["interface_state"] = {"console_items": data_dict["console_items"]}
            cdict = make_jsonizable_and_compress(console_dict)
            save_dict = {}
            save_dict["file_id"] = self.fs.put(cdict)
            save_dict["user_id"] = self.user_id
            unique_id = store_temp_data(self.db, save_dict)
            self.mworker.emit_to_main_client("notebook-open", {"message": "notebook-open", "the_id": unique_id})
            return

        self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)
        return {"success": True}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        log_text = docker_functions.get_log(container_id).decode()
        return {"success": True, "log_text": log_text}
```

#### Paste
* create toolbar button
* create function that gets and inserts
* create handler on python side

```python
@app.route('/load_temp_page/<the_id>', methods=['get', 'post'])
@login_required
def load_temp_page(the_id):
    template_data = read_temp_data(db, the_id)
    delete_temp_data(db, the_id)
    return render_template(template_data["template_name"], **template_data)
```

## When console item shrunk show first line

- [x] done

## Insert resource link in cell

#### Create resource select dialog

Model after this:

 ```_changeCollection() ```
``` showSelectDialog```

#### Create toolbar button to show this

look inside here
```javascript
class ConsoleComponent extends React.Component {}
```

#### Paste in the link

`[collection: civil_war](main_collection/civil_war)`

