/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel

DOC_TYPE = "notebook";

MARGIN_SIZE = 5;
INITIAL_LEFT_FRACTION = .69;

let body_template;
let body_template_hidden;




class TableObjectClass {
    constructor (data_object ) {
        this.collection_name = null;
        consoleObject = new ConsoleObjectClass();
    }

    resize_table_area () {

    }
    startTableSpinner  () {

     }

    stopTableSpinner  () {

     }

    consoleLog (data_object) {
        consoleObject.consoleLog(data_object);
    }

    consoleCodeLog (data_object) {
        consoleObject.consoleCodeLog(data_object)
    }

    consoleCodePrint (data_object) {
        consoleObject.consoleCodePrint(data_object)
    }

    stopConsoleSpinner (data_object) {
        consoleObject.stopConsoleSpinner(data_object)
    }

    clearConsole () {
        consoleObject.clearConsole()
     }

}
