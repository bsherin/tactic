### It looks like project_dict["used_modules/loaded_modules"] is missing some loaded modules
### So projects can be loaded by manually loading the required tiles
### Now when trying to save I'm not able to recreate the problem of creating a flawed project_dict

```python
    @task_worthy
    def load_source_and_recreate(self, data):
        result = self.load_source(data)
        if not result["success"]:
            return result
        return self.recreate_from_save(data["tile_save_dict"])

    @task_worthy
    def load_source(self, data_dict):
        try:
            tile_code = data_dict["tile_code"]
            result = exec_tile_code(tile_code)
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return result



 def recreate_one_tile(self, data, task_packet):
    lsdata = {"tile_code": tile_code, "tile_save_dict": tile_save_dict}
    self.mworker.post_task(new_id[0], "load_source_and_recreate", lsdata, recreate_done,
                               expiration=60, error_handler=handle_response_error)
```

The load_source_and_recreate does get to the tile
But it never gets into recreate_from_save

### Note: the difference in got klist between successful and unsuccessful tiles
### Somehow the tiles that failed just aren't loaded!


```
, 15:18:02: in handle_delivery with task_type initialize_project_mainwindow
entering intialize project mainwindow
entering mainwindow_init
done with init
leaving initialize_project_mainwindow
Nov 12, 2021, 15:18:02: in handle_delivery with task_type remove_ready_block
Nov 12, 2021, 15:18:02: Ignoring task type remove_ready_block for my_id 3a6ef521-cca0-4a20-83ed-df33b521c06a
Nov 12, 2021, 15:18:02: in handle_delivery with task_type do_full_recreation
Nov 12, 2021, 15:18:02: Entering do_full_recreation
entering recreate_from_save in main
got the project_dict
looping over project_dict items
about to call create_pseudo_tile in recreate_from-save
entering create_pseudo_tile
posting register_container to the host with id c529e479-262d-47dc-be38-5d8c68a9d7e6
about to instantiate
returned from create_pseudo_tile
looping over tile_instances
Nov 12, 2021, 15:18:03: loaded modules is ['CVAClassifierNewCV']
Nov 12, 2021, 15:18:03: in handle_delivery with task_type load_module_if_necessary
Nov 12, 2021, 15:18:03: entering track_loaded_modules
Nov 12, 2021, 15:18:03: finished loading modules, ready to recreate tiles
Nov 12, 2021, 15:18:03: about to recreate tiles one at a time
Nov 12, 2021, 15:18:04: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type HTMLReceiver
got klist []
posting register_container to the host with id fa42c483-8be3-475c-991b-25c83be60c5c
Nov 12, 2021, 15:18:05: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type ExplainPrediction
got klist []
posting register_container to the host with id d7fff525-5633-4b43-81cb-35e758f0963f
Nov 12, 2021, 15:18:06: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type ListPlotter
got klist ['bsherinrem.user_tiles.plot.ListPlotter']
posting register_container to the host with id 181bd411-9743-4c44-a507-831b45c3385f
Nov 12, 2021, 15:18:07: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type word2vec
got klist []
posting register_container to the host with id 4ef6f644-c6b7-46d5-b260-f57750739467
Nov 12, 2021, 15:18:08: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type CVAClassifierNewCV
got klist ['bsherinrem.user_tiles.classify.CVAClassifierNewCV']
posting register_container to the host with id 11a09030-6b03-471b-b545-93f428c32e69
Nov 12, 2021, 15:18:10: in handle_delivery with task_type recreate_one_tile
in recreate one tile
in get_tile_code in main
in get_tile_code in loaded_tile_management with username bsherinrem, tile_type word2vec2trainer
got klist []
posting regi
```