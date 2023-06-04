
## Multiple cell select

X Make list of all selected
X Pass this appropriately down to cells
X Shift-click adds / removes from list
* other actions:
  * Select just one if appropriate to act on
  * Operate on all if appropriate
  * Reduce selection to one if appropriate
* Copy can copy multiple
* Paste can Past multiple

---
console component
state:
* currently_selected_item
* 
* 
methods
* _selectConsoleItem
  * This updates the console state and also changes the selection state for each item
* _clearSelectedItem

individual console items
```python
    _consoleItemClick(e) {
        this._selectMe();
        e.stopPropagation()
    }

    _selectMe(callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, callback)
    }
```