

Where I am:

* I think this is good now.


Main_tasks_mixin: `compile_save_dict:
* `result["tile_instances"] = tile_save_dicts`
* tile_save_dicts is a dict, with keys of tile_ids
    * also each value has `tile_save_dict["tile_id"]`


---

docker_function: `create_container`
 * has arg `special_unique_id`
 
main: `create_tile_container(self, data)`
 * calls `create_container(... special_unique_id=data["tile_id"])`
 * in most places, data["tile_id"] is None
 * except in `recreate_one_tile`
 
main_tasks_mixin:`recreate_one_tile`:
 * data has `data["old_tile_id"]`
 * called only from `do_full_recreation`
 
main_tasks_mixin: `do_full_recreation`:
             for old_tile_id, tile_save_dict in project_dict["tile_instances"].items():
                tile_info_dict[old_tile_id] = tile_save_dict["tile_type"]
```python
for old_tile_id, tile_save_dict in self.project_dict["tile_instances"].items():
    data_for_tile = {"old_tile_id": old_tile_id,
                                     "tile_save_dict": tile_save_dict}
    self.mworker.post_task(self.mworker.my_id, "recreate_one_tile", data_for_tile,
                           track_recreated_tiles)
```

---

### javascript side:

main_app.jsx

* `save_attrs` has `tile_list`, which has tile_ids
    * `tile_list` is passed to `TileContainer` which contains the tile components
* each entry in `tile_list` has a `tile_id`
* `tile_id` is a prop for `TileComponent`

---
So places that tile_ids live is:

* As keys and in the values of in tile_instances
  * In tile_instance[tile_id]["tile_id"]
* tile_list is in interface_state



 