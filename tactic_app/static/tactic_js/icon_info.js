
export {tile_icon_dict, tile_icon_categories}

const raw_icon_info = [
    {
        "displayName": "Blank",
        "iconName": "blank",
        "tags": "empty, placeholder",
        "group": "miscellaneous",
        "codepoint": 61747
    },
    {
        "displayName": "Style",
        "iconName": "style",
        "tags": "visual style, editor",
        "group": "editor",
        "codepoint": 62164
    },
    {
        "displayName": "Align: left",
        "iconName": "align-left",
        "tags": "text flow, alignment, justification, range, flush left",
        "group": "editor",
        "codepoint": 61709
    },
    {
        "displayName": "Align: center",
        "iconName": "align-center",
        "tags": "text flow, alignment, justification, range, centered",
        "group": "editor",
        "codepoint": 61707
    },
    {
        "displayName": "Align: right",
        "iconName": "align-right",
        "tags": "text flow, alignment, justification, range, flush right",
        "group": "editor",
        "codepoint": 61710
    },
    {
        "displayName": "Align: justify",
        "iconName": "align-justify",
        "tags": "text flow, alignment, justification, range, justified",
        "group": "editor",
        "codepoint": 61708
    },
    {
        "displayName": "Bold",
        "iconName": "bold",
        "tags": "typography, text, font style, weight, bold",
        "group": "editor",
        "codepoint": 61749
    },
    {
        "displayName": "Italic",
        "iconName": "italic",
        "tags": "typography, text, font style, italic, cursive",
        "group": "editor",
        "codepoint": 61962
    },
    {
        "displayName": "Underline",
        "iconName": "underline",
        "tags": "typography, text, font style, underline, underscore",
        "group": "editor",
        "codepoint": 62209
    },
    {
        "displayName": "Search around",
        "iconName": "search-around",
        "tags": "search, exploration, information, area, graph",
        "group": "action",
        "codepoint": 62111
    },
    {
        "displayName": "Remove from graph",
        "iconName": "graph-remove",
        "tags": "circle, remove, delete, clear, graph",
        "group": "action",
        "codepoint": 61908
    },
    {
        "displayName": "Group objects",
        "iconName": "group-objects",
        "tags": "group, alignment, organization, arrangement, classification, objects",
        "group": "action",
        "codepoint": 61914
    },
    {
        "displayName": "Merge into links",
        "iconName": "merge-links",
        "tags": "merge, combine, consolidate, jointment, links",
        "group": "action",
        "codepoint": 62018
    },
    {
        "displayName": "Layout",
        "iconName": "layout",
        "tags": "layout, presentation, arrangement, graph",
        "group": "data",
        "codepoint": 61989
    },
    {
        "displayName": "Layout: auto",
        "iconName": "layout-auto",
        "tags": "layout, presentation, arrangement, auto, graph, grid",
        "group": "data",
        "codepoint": 61980
    },
    {
        "displayName": "Layout: circle",
        "iconName": "layout-circle",
        "tags": "layout, presentation, arrangement, circle, graph, grid",
        "group": "data",
        "codepoint": 61982
    },
    {
        "displayName": "Layout: hierarchy",
        "iconName": "layout-hierarchy",
        "tags": "layout, presentation, arrangement, hierarchy, order, graph, grid",
        "group": "data",
        "codepoint": 61985
    },
    {
        "displayName": "Layout: grid",
        "iconName": "layout-grid",
        "tags": "layout, presentation, arrangement, grid, graph, grid",
        "group": "data",
        "codepoint": 61983
    },
    {
        "displayName": "Layout: group by",
        "iconName": "layout-group-by",
        "tags": "layout, presentation, arrangement, group by, graph, grid",
        "group": "data",
        "codepoint": 61984
    },
    {
        "displayName": "Layout: skew grid",
        "iconName": "layout-skew-grid",
        "tags": "layout, presentation, arrangement, skew, graph, grid",
        "group": "data",
        "codepoint": 61987
    },
    {
        "displayName": "Geosearch",
        "iconName": "geosearch",
        "tags": "search, exploration, topography, geography, location, area, magnifying glass, globe",
        "group": "action",
        "codepoint": 61897
    },
    {
        "displayName": "Heatmap",
        "iconName": "heatmap",
        "tags": "hierarchy, matrix, heat map",
        "group": "data",
        "codepoint": 61930
    },
    {
        "displayName": "Drive time",
        "iconName": "drive-time",
        "tags": "car, automobile, vehicle, van, drive, ride, distance, navigation, directions",
        "group": "interface",
        "codepoint": 61842
    },
    {
        "displayName": "Select",
        "iconName": "select",
        "tags": "selection, arrow, cursor, area, range",
        "group": "action",
        "codepoint": 62116
    },
    {
        "displayName": "Predictive analysis",
        "iconName": "predictive-analysis",
        "tags": "analysis, investigation, search, study, test, brain",
        "group": "action",
        "codepoint": 62076
    },
    {
        "displayName": "Layers",
        "iconName": "layers",
        "tags": "layers, levels, stack, cards",
        "group": "interface",
        "codepoint": 61979
    },
    {
        "displayName": "Locate",
        "iconName": "locate",
        "tags": "target, location, destination, mark, map, area",
        "group": "action",
        "codepoint": 62001
    },
    {
        "displayName": "Bookmark",
        "iconName": "bookmark",
        "tags": "bookmark, marker, holder, section, identifier, favorites",
        "group": "action",
        "codepoint": 61751
    },
    {
        "displayName": "Citation",
        "iconName": "citation",
        "tags": "quotation, citation, marks, excerpt",
        "group": "editor",
        "codepoint": 61780
    },
    {
        "displayName": "Tag",
        "iconName": "tag",
        "tags": "tag, label, badge, identification",
        "group": "action",
        "codepoint": 62175
    },
    {
        "displayName": "Clipboard",
        "iconName": "clipboard",
        "tags": "clipboard, notepad, notebook, copy, paste, transfer, storage",
        "group": "action",
        "codepoint": 61783
    },
    {
        "displayName": "Selection",
        "iconName": "selection",
        "tags": "selection, collection, circle, ring",
        "group": "action",
        "codepoint": 62117
    },
    {
        "displayName": "Events",
        "iconName": "timeline-events",
        "tags": "calendar, timeframe, agenda, diary, day, week, month",
        "group": "interface",
        "codepoint": 62195
    },
    {
        "displayName": "Line chart",
        "iconName": "timeline-line-chart",
        "tags": "graph, line, chart",
        "group": "data",
        "codepoint": 62196
    },
    {
        "displayName": "Bar chart",
        "iconName": "timeline-bar-chart",
        "tags": "graph, bar, chart",
        "group": "data",
        "codepoint": 62194
    },
    {
        "displayName": "Applications",
        "iconName": "applications",
        "tags": "application, browser, windows, platforms",
        "group": "interface",
        "codepoint": 61721
    },
    {
        "displayName": "Projects",
        "iconName": "projects",
        "tags": "drawer, sections",
        "group": "interface",
        "codepoint": 62080
    },
    {
        "displayName": "Changes",
        "iconName": "changes",
        "tags": "arrows, direction, switch",
        "group": "action",
        "codepoint": 61766
    },
    {
        "displayName": "Notifications",
        "iconName": "notifications",
        "tags": "notifications, bell, alarm, notice, warning",
        "group": "interface",
        "codepoint": 62046
    },
    {
        "displayName": "Lock",
        "iconName": "lock",
        "tags": "lock, engage, connect, join, close",
        "group": "action",
        "codepoint": 62002
    },
    {
        "displayName": "Unlock",
        "iconName": "unlock",
        "tags": "unlock, disengage, disconnect, separate, open",
        "group": "action",
        "codepoint": 62213
    },
    {
        "displayName": "User",
        "iconName": "user",
        "tags": "person, human, male, female, character, customer, individual",
        "group": "interface",
        "codepoint": 62218
    },
    {
        "displayName": "Search template",
        "iconName": "search-template",
        "tags": "search, text, magnifying glass",
        "group": "action",
        "codepoint": 62112
    },
    {
        "displayName": "Inbox",
        "iconName": "inbox",
        "tags": "folder, mail, file, message",
        "group": "file",
        "codepoint": 61951
    },
    {
        "displayName": "More",
        "iconName": "more",
        "tags": "dots, three, extra, new, options",
        "group": "interface",
        "codepoint": 62026
    },
    {
        "displayName": "Help",
        "iconName": "help",
        "tags": "question mark, aid, advice, circle",
        "group": "action",
        "codepoint": 61932
    },
    {
        "displayName": "Calendar",
        "iconName": "calendar",
        "tags": "calendar, timeframe, agenda, diary, day, week, month",
        "group": "interface",
        "codepoint": 61758
    },
    {
        "displayName": "Media",
        "iconName": "media",
        "tags": "audio, video, media, picture, image, drawing, illustration",
        "group": "media",
        "codepoint": 62013
    },
    {
        "displayName": "Link",
        "iconName": "link",
        "tags": "link, connection, network",
        "group": "interface",
        "codepoint": 61997
    },
    {
        "displayName": "Share",
        "iconName": "share",
        "tags": "share, square, arrow",
        "group": "action",
        "codepoint": 62129
    },
    {
        "displayName": "Download",
        "iconName": "download",
        "tags": "circle, arrow, down, downloading",
        "group": "action",
        "codepoint": 61834
    },
    {
        "displayName": "Document",
        "iconName": "document",
        "tags": "document, paper, page, file",
        "group": "file",
        "codepoint": 61824
    },
    {
        "displayName": "Properties",
        "iconName": "properties",
        "tags": "lines, dots, three, list",
        "group": "interface",
        "codepoint": 62081
    },
    {
        "displayName": "Import",
        "iconName": "import",
        "tags": "arrow, down, importing,",
        "group": "action",
        "codepoint": 61946
    },
    {
        "displayName": "Export",
        "iconName": "export",
        "tags": "arrow, up, exporting",
        "group": "action",
        "codepoint": 61856
    },
    {
        "displayName": "Minimize",
        "iconName": "minimize",
        "tags": "arrows, decrease, smaller",
        "group": "action",
        "codepoint": 62019
    },
    {
        "displayName": "Maximize",
        "iconName": "maximize",
        "tags": "arrows, increase, bigger",
        "group": "action",
        "codepoint": 62012
    },
    {
        "displayName": "Tick",
        "iconName": "tick",
        "tags": "mark, sign, ok, approved, success",
        "group": "action",
        "codepoint": 62191
    },
    {
        "displayName": "Cross",
        "iconName": "cross",
        "tags": "cross mark, fail, delete, no, close, remove",
        "group": "action",
        "codepoint": 61801
    },
    {
        "displayName": "Plus",
        "iconName": "plus",
        "tags": "sign, add, maximize, zoom in",
        "group": "action",
        "codepoint": 62073
    },
    {
        "displayName": "Minus",
        "iconName": "minus",
        "tags": "sign, remove, minimize, zoom out",
        "group": "action",
        "codepoint": 62020
    },
    {
        "displayName": "Arrow: left",
        "iconName": "arrow-left",
        "tags": "arrow, direction, left",
        "group": "interface",
        "codepoint": 61733
    },
    {
        "displayName": "Arrow: right",
        "iconName": "arrow-right",
        "tags": "arrow, direction, right",
        "group": "interface",
        "codepoint": 61734
    },
    {
        "displayName": "Exchange",
        "iconName": "exchange",
        "tags": "arrows, direction, exchange, network, swap, transfer, transaction",
        "group": "action",
        "codepoint": 61853
    },
    {
        "displayName": "Comparison",
        "iconName": "comparison",
        "tags": "comparison, analogy, layout, contrast",
        "group": "action",
        "codepoint": 61793
    },
    {
        "displayName": "List",
        "iconName": "list",
        "tags": "agenda, four lines, table",
        "group": "table",
        "codepoint": 62000
    },
    {
        "displayName": "Filter",
        "iconName": "filter",
        "tags": "filtering, funnel, tube, pipe",
        "group": "action",
        "codepoint": 61869
    },
    {
        "displayName": "Confirm",
        "iconName": "confirm",
        "tags": "circle, tick, confirmation, acceptance, approval, authorization",
        "group": "action",
        "codepoint": 61796
    },
    {
        "displayName": "Fork",
        "iconName": "fork",
        "tags": "divide, split, break, arrows, direction",
        "group": "action",
        "codepoint": 61888
    },
    {
        "displayName": "Trash",
        "iconName": "trash",
        "tags": "bin, rubbish, junk, remove, delete",
        "group": "action",
        "codepoint": 62202
    },
    {
        "displayName": "Person",
        "iconName": "person",
        "tags": "person, human, male, female, character, customer, individual",
        "group": "interface",
        "codepoint": 62066
    },
    {
        "displayName": "People",
        "iconName": "people",
        "tags": "people, humans, males, females, characters, customers, individuals",
        "group": "interface",
        "codepoint": 62064
    },
    {
        "displayName": "Add",
        "iconName": "add",
        "tags": "circle, plus, symbol, join",
        "group": "action",
        "codepoint": 61705
    },
    {
        "displayName": "Remove",
        "iconName": "remove",
        "tags": "circle, minus, symbol, remove",
        "group": "action",
        "codepoint": 62096
    },
    {
        "displayName": "Geolocation",
        "iconName": "geolocation",
        "tags": "geography, location, position, map, direction",
        "group": "interface",
        "codepoint": 61896
    },
    {
        "displayName": "Zoom in",
        "iconName": "zoom-in",
        "tags": "search, magnifying glass, plus",
        "group": "action",
        "codepoint": 62238
    },
    {
        "displayName": "Zoom out",
        "iconName": "zoom-out",
        "tags": "search, magnifying glass, minus",
        "group": "action",
        "codepoint": 62239
    },
    {
        "displayName": "Refresh",
        "iconName": "refresh",
        "tags": "circle, arrows, rotation",
        "group": "action",
        "codepoint": 62089
    },
    {
        "displayName": "Delete",
        "iconName": "delete",
        "tags": "circle, remove, cross",
        "group": "action",
        "codepoint": 61813
    },
    {
        "displayName": "Cog",
        "iconName": "cog",
        "tags": "settings, circle,",
        "group": "interface",
        "codepoint": 61789
    },
    {
        "displayName": "Flag",
        "iconName": "flag",
        "tags": "map, position, country, nationality",
        "group": "interface",
        "codepoint": 61870
    },
    {
        "displayName": "Pin",
        "iconName": "pin",
        "tags": "map, position, safety pin, attach",
        "group": "action",
        "codepoint": 62069
    },
    {
        "displayName": "Warning sign",
        "iconName": "warning-sign",
        "tags": "notification, warning, triangle, exclamation mark, sign",
        "group": "interface",
        "codepoint": 62229
    },
    {
        "displayName": "Error",
        "iconName": "error",
        "tags": "notification, failure, circle, exclamation mark, sign",
        "group": "interface",
        "codepoint": 61851
    },
    {
        "displayName": "Info sign",
        "iconName": "info-sign",
        "tags": "notification, information, circle, message, sign",
        "group": "interface",
        "codepoint": 61952
    },
    {
        "displayName": "Credit card",
        "iconName": "credit-card",
        "tags": "payment, bank, transaction",
        "group": "action",
        "codepoint": 61800
    },
    {
        "displayName": "Edit",
        "iconName": "edit",
        "tags": "annotate, pen, modify",
        "group": "action",
        "codepoint": 61844
    },
    {
        "displayName": "History",
        "iconName": "history",
        "tags": "past, reverse, circle, arrow",
        "group": "action",
        "codepoint": 61936
    },
    {
        "displayName": "Search",
        "iconName": "search",
        "tags": "inspection, exploration, magnifying glass",
        "group": "action",
        "codepoint": 62114
    },
    {
        "displayName": "Logout",
        "iconName": "log-out",
        "tags": "arrow, leave",
        "group": "action",
        "codepoint": 62004
    },
    {
        "displayName": "Star",
        "iconName": "star",
        "tags": "shape, pin, mark, pro",
        "group": "interface",
        "codepoint": 62157
    },
    {
        "displayName": "Star: empty",
        "iconName": "star-empty",
        "tags": "shape, unpin, mark",
        "group": "interface",
        "codepoint": 62156
    },
    {
        "displayName": "Sort: alphabetical",
        "iconName": "sort-alphabetical",
        "tags": "ascending, array, arrange",
        "group": "action",
        "codepoint": 62146
    },
    {
        "displayName": "Sort: numerical",
        "iconName": "sort-numerical",
        "tags": "ascending, array, arrange",
        "group": "action",
        "codepoint": 62150
    },
    {
        "displayName": "Sort",
        "iconName": "sort",
        "tags": "ascending, array, arrange",
        "group": "action",
        "codepoint": 62151
    },
    {
        "displayName": "Folder: opened",
        "iconName": "folder-open",
        "tags": "file, portfolio, case",
        "group": "file",
        "codepoint": 61882
    },
    {
        "displayName": "Folder: closed",
        "iconName": "folder-close",
        "tags": "file, portfolio, case",
        "group": "file",
        "codepoint": 61880
    },
    {
        "displayName": "Folder: shared",
        "iconName": "folder-shared",
        "tags": "file, portfolio, case",
        "group": "file",
        "codepoint": 61884
    },
    {
        "displayName": "Caret: up",
        "iconName": "caret-up",
        "tags": "direction, order, up",
        "group": "interface",
        "codepoint": 61763
    },
    {
        "displayName": "Caret: right",
        "iconName": "caret-right",
        "tags": "direction, order, right",
        "group": "interface",
        "codepoint": 61762
    },
    {
        "displayName": "Caret: down",
        "iconName": "caret-down",
        "tags": "direction, order, down",
        "group": "interface",
        "codepoint": 61760
    },
    {
        "displayName": "Caret: left",
        "iconName": "caret-left",
        "tags": "direction, order, left",
        "group": "interface",
        "codepoint": 61761
    },
    {
        "displayName": "Menu: opened",
        "iconName": "menu-open",
        "tags": "show, navigation",
        "group": "interface",
        "codepoint": 62015
    },
    {
        "displayName": "Menu: closed",
        "iconName": "menu-closed",
        "tags": "hide, navigation",
        "group": "interface",
        "codepoint": 62014
    },
    {
        "displayName": "Feed",
        "iconName": "feed",
        "tags": "rss, feed",
        "group": "interface",
        "codepoint": 61863
    },
    {
        "displayName": "Two columns",
        "iconName": "two-columns",
        "tags": "layout, columns, switch, change, two",
        "group": "action",
        "codepoint": 62207
    },
    {
        "displayName": "One column",
        "iconName": "one-column",
        "tags": "layout, columns, switch, change, one",
        "group": "action",
        "codepoint": 62052
    },
    {
        "displayName": "Dot",
        "iconName": "dot",
        "tags": "point, circle, small",
        "group": "miscellaneous",
        "codepoint": 61826
    },
    {
        "displayName": "Property",
        "iconName": "property",
        "tags": "list, order",
        "group": "interface",
        "codepoint": 62082
    },
    {
        "displayName": "Time",
        "iconName": "time",
        "tags": "clock, day, hours, minutes, seconds",
        "group": "interface",
        "codepoint": 62192
    },
    {
        "displayName": "Disable",
        "iconName": "disable",
        "tags": "off, circle, remove",
        "group": "action",
        "codepoint": 61821
    },
    {
        "displayName": "Unpin",
        "iconName": "unpin",
        "tags": "map, position, safety pin, detach",
        "group": "action",
        "codepoint": 62214
    },
    {
        "displayName": "Flows",
        "iconName": "flows",
        "tags": "arrows, direction, links",
        "group": "data",
        "codepoint": 61879
    },
    {
        "displayName": "New text box",
        "iconName": "new-text-box",
        "tags": "text box, edit, new, create",
        "group": "action",
        "codepoint": 62041
    },
    {
        "displayName": "New link",
        "iconName": "new-link",
        "tags": "create, add, plus, links",
        "group": "action",
        "codepoint": 62037
    },
    {
        "displayName": "New object",
        "iconName": "new-object",
        "tags": "create, add, plus, objects, circle",
        "group": "action",
        "codepoint": 62038
    },
    {
        "displayName": "Path search",
        "iconName": "path-search",
        "tags": "map, magnifying glass, position, location",
        "group": "action",
        "codepoint": 62061
    },
    {
        "displayName": "Automatic updates",
        "iconName": "automatic-updates",
        "tags": "circle, arrows, tick, amends, updates",
        "group": "action",
        "codepoint": 61741
    },
    {
        "displayName": "Page layout",
        "iconName": "page-layout",
        "tags": "browser, table, design, columns",
        "group": "table",
        "codepoint": 62056
    },
    {
        "displayName": "Code",
        "iconName": "code",
        "tags": "code, markup, language, tag",
        "group": "action",
        "codepoint": 61788
    },
    {
        "displayName": "Map",
        "iconName": "map",
        "tags": "map, location, position, geography, world",
        "group": "interface",
        "codepoint": 62011
    },
    {
        "displayName": "Search text",
        "iconName": "search-text",
        "tags": "magnifying glass, exploration",
        "group": "action",
        "codepoint": 62113
    },
    {
        "displayName": "Envelope",
        "iconName": "envelope",
        "tags": "post, mail, send, email",
        "group": "interface",
        "codepoint": 61848
    },
    {
        "displayName": "Paperclip",
        "iconName": "paperclip",
        "tags": "attachments, add",
        "group": "action",
        "codepoint": 62059
    },
    {
        "displayName": "Label",
        "iconName": "label",
        "tags": "text, tag, ticket",
        "group": "interface",
        "codepoint": 61976
    },
    {
        "displayName": "Globe",
        "iconName": "globe",
        "tags": "planet, earth, map, location, geography, world",
        "group": "miscellaneous",
        "codepoint": 61907
    },
    {
        "displayName": "Home",
        "iconName": "home",
        "tags": "house, building, destination",
        "group": "miscellaneous",
        "codepoint": 61937
    },
    {
        "displayName": "Table",
        "iconName": "th",
        "tags": "index, rows, columns, agenda, list, spreadsheet",
        "group": "table",
        "codepoint": 62186
    },
    {
        "displayName": "Table: list",
        "iconName": "th-list",
        "tags": "index, rows, list, order, series",
        "group": "table",
        "codepoint": 62185
    },
    {
        "displayName": "Table: derived",
        "iconName": "th-derived",
        "tags": "get, obtain, take, acquire, index, rows, columns, list",
        "group": "table",
        "codepoint": 62182
    },
    {
        "displayName": "Circle",
        "iconName": "circle",
        "tags": "radial, empty, area, radius, selection",
        "group": "action",
        "codepoint": 61779
    },
    {
        "displayName": "Draw",
        "iconName": "draw",
        "tags": "selection, area, highlight, sketch",
        "group": "action",
        "codepoint": 61837
    },
    {
        "displayName": "Insert",
        "iconName": "insert",
        "tags": "square, plus, add, embed, include, inject",
        "group": "action",
        "codepoint": 61956
    },
    {
        "displayName": "Helper management",
        "iconName": "helper-management",
        "tags": "square, widget",
        "group": "interface",
        "codepoint": 61933
    },
    {
        "displayName": "Send to",
        "iconName": "send-to",
        "tags": "circle, export, arrow",
        "group": "action",
        "codepoint": 62121
    },
    {
        "displayName": "Eye",
        "iconName": "eye-open",
        "tags": "show, visible, clear, view, vision",
        "group": "interface",
        "codepoint": 61859
    },
    {
        "displayName": "Folder: shared open",
        "iconName": "folder-shared-open",
        "tags": "file, portfolio, case",
        "group": "file",
        "codepoint": 61883
    },
    {
        "displayName": "Social media",
        "iconName": "social-media",
        "tags": "circle, rotate, share",
        "group": "action",
        "codepoint": 62144
    },
    {
        "displayName": "Arrow: up",
        "iconName": "arrow-up",
        "tags": "direction, north",
        "group": "interface",
        "codepoint": 61737
    },
    {
        "displayName": "Arrow: down",
        "iconName": "arrow-down",
        "tags": "direction, south",
        "group": "interface",
        "codepoint": 61732
    },
    {
        "displayName": "Arrows: horizontal",
        "iconName": "arrows-horizontal",
        "tags": "direction, level",
        "group": "interface",
        "codepoint": 61738
    },
    {
        "displayName": "Arrows: vertical",
        "iconName": "arrows-vertical",
        "tags": "direction, level",
        "group": "interface",
        "codepoint": 61739
    },
    {
        "displayName": "Resolve",
        "iconName": "resolve",
        "tags": "circles, divide, split",
        "group": "action",
        "codepoint": 62099
    },
    {
        "displayName": "Graph",
        "iconName": "graph",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 61909
    },
    {
        "displayName": "Briefcase",
        "iconName": "briefcase",
        "tags": "suitcase, business, case, baggage,",
        "group": "miscellaneous",
        "codepoint": 61753
    },
    {
        "displayName": "Dollar",
        "iconName": "dollar",
        "tags": "currency, money",
        "group": "miscellaneous",
        "codepoint": 61825
    },
    {
        "displayName": "Ninja",
        "iconName": "ninja",
        "tags": "star, fighter, symbol",
        "group": "miscellaneous",
        "codepoint": 62042
    },
    {
        "displayName": "Delta",
        "iconName": "delta",
        "tags": "alt j, symbol",
        "group": "miscellaneous",
        "codepoint": 61814
    },
    {
        "displayName": "Barcode",
        "iconName": "barcode",
        "tags": "product, scan,",
        "group": "miscellaneous",
        "codepoint": 61746
    },
    {
        "displayName": "Torch",
        "iconName": "torch",
        "tags": "light, flashlight, tool",
        "group": "miscellaneous",
        "codepoint": 62198
    },
    {
        "displayName": "Widget",
        "iconName": "widget",
        "tags": "square, corners",
        "group": "interface",
        "codepoint": 62235
    },
    {
        "displayName": "Unresolve",
        "iconName": "unresolve",
        "tags": "split, divide, disconnect, separate",
        "group": "action",
        "codepoint": 62215
    },
    {
        "displayName": "Offline",
        "iconName": "offline",
        "tags": "circle, lightning, disconnected, down",
        "group": "interface",
        "codepoint": 62050
    },
    {
        "displayName": "Zoom to fit",
        "iconName": "zoom-to-fit",
        "tags": "fit, scale, resize, adjust",
        "group": "action",
        "codepoint": 62240
    },
    {
        "displayName": "Add to artifact",
        "iconName": "add-to-artifact",
        "tags": "list, plus",
        "group": "action",
        "codepoint": 61703
    },
    {
        "displayName": "Map marker",
        "iconName": "map-marker",
        "tags": "pin, map, location, position, geography, world",
        "group": "interface",
        "codepoint": 62010
    },
    {
        "displayName": "Chart",
        "iconName": "chart",
        "tags": "arrow, increase, up, line, bar, graph",
        "group": "data",
        "codepoint": 61767
    },
    {
        "displayName": "Control",
        "iconName": "control",
        "tags": "squares, layout",
        "group": "interface",
        "codepoint": 61799
    },
    {
        "displayName": "Multi select",
        "iconName": "multi-select",
        "tags": "layers, selection",
        "group": "interface",
        "codepoint": 62030
    },
    {
        "displayName": "Direction: left",
        "iconName": "direction-left",
        "tags": "pointer, west",
        "group": "interface",
        "codepoint": 61819
    },
    {
        "displayName": "Direction: right",
        "iconName": "direction-right",
        "tags": "pointer, east",
        "group": "interface",
        "codepoint": 61820
    },
    {
        "displayName": "Database",
        "iconName": "database",
        "tags": "stack, storage",
        "group": "data",
        "codepoint": 61812
    },
    {
        "displayName": "Pie chart",
        "iconName": "pie-chart",
        "tags": "circle, part, section",
        "group": "data",
        "codepoint": 62068
    },
    {
        "displayName": "Full circle",
        "iconName": "full-circle",
        "tags": "dot, point",
        "group": "miscellaneous",
        "codepoint": 61890
    },
    {
        "displayName": "Square",
        "iconName": "square",
        "tags": "empty, outline",
        "group": "miscellaneous",
        "codepoint": 62153
    },
    {
        "displayName": "Print",
        "iconName": "print",
        "tags": "printer, paper",
        "group": "action",
        "codepoint": 62079
    },
    {
        "displayName": "Presentation",
        "iconName": "presentation",
        "tags": "display, presentation",
        "group": "interface",
        "codepoint": 62078
    },
    {
        "displayName": "Ungroup objects",
        "iconName": "ungroup-objects",
        "tags": "split, divide, disconnect, separate",
        "group": "action",
        "codepoint": 62211
    },
    {
        "displayName": "Chat",
        "iconName": "chat",
        "tags": "speech, conversation, communication, talk",
        "group": "action",
        "codepoint": 61768
    },
    {
        "displayName": "Comment",
        "iconName": "comment",
        "tags": "statement, discussion, opinion, view",
        "group": "action",
        "codepoint": 61792
    },
    {
        "displayName": "Circle arrow: right",
        "iconName": "circle-arrow-right",
        "tags": "direction, east",
        "group": "interface",
        "codepoint": 61777
    },
    {
        "displayName": "Circle arrow: left",
        "iconName": "circle-arrow-left",
        "tags": "direction, west",
        "group": "interface",
        "codepoint": 61776
    },
    {
        "displayName": "Circle arrow: up",
        "iconName": "circle-arrow-up",
        "tags": "direction, north",
        "group": "interface",
        "codepoint": 61778
    },
    {
        "displayName": "Circle arrow: down",
        "iconName": "circle-arrow-down",
        "tags": "direction, south",
        "group": "interface",
        "codepoint": 61775
    },
    {
        "displayName": "Upload",
        "iconName": "upload",
        "tags": "arrow, circle, up, transfer",
        "group": "action",
        "codepoint": 62217
    },
    {
        "displayName": "Asterisk",
        "iconName": "asterisk",
        "tags": "note, symbol, starred, marked",
        "group": "miscellaneous",
        "codepoint": 61740
    },
    {
        "displayName": "Cloud",
        "iconName": "cloud",
        "tags": "file, storage, weather",
        "group": "file",
        "codepoint": 61786
    },
    {
        "displayName": "Cloud: download",
        "iconName": "cloud-download",
        "tags": "file, storage, transfer",
        "group": "file",
        "codepoint": 61784
    },
    {
        "displayName": "Cloud: upload",
        "iconName": "cloud-upload",
        "tags": "file, storage, transfer",
        "group": "file",
        "codepoint": 61785
    },
    {
        "displayName": "Repeat",
        "iconName": "repeat",
        "tags": "circle, arrow",
        "group": "action",
        "codepoint": 62097
    },
    {
        "displayName": "Move",
        "iconName": "move",
        "tags": "arrows, directions, position, location",
        "group": "action",
        "codepoint": 62028
    },
    {
        "displayName": "Chevron: left",
        "iconName": "chevron-left",
        "tags": "arrow, direction",
        "group": "interface",
        "codepoint": 61772
    },
    {
        "displayName": "Chevron: right",
        "iconName": "chevron-right",
        "tags": "arrow, direction",
        "group": "interface",
        "codepoint": 61773
    },
    {
        "displayName": "Chevron: up",
        "iconName": "chevron-up",
        "tags": "arrow, direction",
        "group": "interface",
        "codepoint": 61774
    },
    {
        "displayName": "Chevron: down",
        "iconName": "chevron-down",
        "tags": "arrow, direction",
        "group": "interface",
        "codepoint": 61770
    },
    {
        "displayName": "Random",
        "iconName": "random",
        "tags": "arrows, aim",
        "group": "interface",
        "codepoint": 62086
    },
    {
        "displayName": "Fullscreen",
        "iconName": "fullscreen",
        "tags": "size, arrows, increase, proportion, width, height",
        "group": "media",
        "codepoint": 61892
    },
    {
        "displayName": "Login",
        "iconName": "log-in",
        "tags": "arrow, sign in",
        "group": "action",
        "codepoint": 62003
    },
    {
        "displayName": "Heart",
        "iconName": "heart",
        "tags": "love, like, organ, human, feelings",
        "group": "miscellaneous",
        "codepoint": 61928
    },
    {
        "displayName": "Office",
        "iconName": "office",
        "tags": "building, business, location, street",
        "group": "miscellaneous",
        "codepoint": 62049
    },
    {
        "displayName": "Duplicate",
        "iconName": "duplicate",
        "tags": "copy, square, two",
        "group": "action",
        "codepoint": 61843
    },
    {
        "displayName": "Ban circle",
        "iconName": "ban-circle",
        "tags": "circle, refusal",
        "group": "action",
        "codepoint": 61744
    },
    {
        "displayName": "Camera",
        "iconName": "camera",
        "tags": "photograph, picture, video",
        "group": "media",
        "codepoint": 61759
    },
    {
        "displayName": "Mobile video",
        "iconName": "mobile-video",
        "tags": "film, broadcast, television",
        "group": "media",
        "codepoint": 62022
    },
    {
        "displayName": "Video",
        "iconName": "video",
        "tags": "film, broadcast, television",
        "group": "media",
        "codepoint": 62223
    },
    {
        "displayName": "Film",
        "iconName": "film",
        "tags": "movie, cinema, theatre",
        "group": "media",
        "codepoint": 61864
    },
    {
        "displayName": "Settings",
        "iconName": "settings",
        "tags": "controls, knobs",
        "group": "media",
        "codepoint": 62127
    },
    {
        "displayName": "Volume: off",
        "iconName": "volume-off",
        "tags": "audio, video, speaker, music, sound, low",
        "group": "media",
        "codepoint": 62226
    },
    {
        "displayName": "Volume: down",
        "iconName": "volume-down",
        "tags": "audio, video, speaker, music, sound",
        "group": "media",
        "codepoint": 62225
    },
    {
        "displayName": "Volume: up",
        "iconName": "volume-up",
        "tags": "audio, video, speaker, music, sound, high",
        "group": "media",
        "codepoint": 62227
    },
    {
        "displayName": "Music",
        "iconName": "music",
        "tags": "audio, video, note, sound",
        "group": "media",
        "codepoint": 62031
    },
    {
        "displayName": "Step backward",
        "iconName": "step-backward",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62158
    },
    {
        "displayName": "Fast backward",
        "iconName": "fast-backward",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 61860
    },
    {
        "displayName": "Pause",
        "iconName": "pause",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62063
    },
    {
        "displayName": "Stop",
        "iconName": "stop",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62161
    },
    {
        "displayName": "Play",
        "iconName": "play",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62072
    },
    {
        "displayName": "Fast forward",
        "iconName": "fast-forward",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 61861
    },
    {
        "displayName": "Step forward",
        "iconName": "step-forward",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62160
    },
    {
        "displayName": "Eject",
        "iconName": "eject",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 61845
    },
    {
        "displayName": "Record",
        "iconName": "record",
        "tags": "player, media, controls, digital, analogue, film, audio, video",
        "group": "media",
        "codepoint": 62087
    },
    {
        "displayName": "Desktop",
        "iconName": "desktop",
        "tags": "screen, monitor, display",
        "group": "media",
        "codepoint": 61816
    },
    {
        "displayName": "Phone",
        "iconName": "phone",
        "tags": "telephone, call, ring",
        "group": "media",
        "codepoint": 62067
    },
    {
        "displayName": "Lightbulb",
        "iconName": "lightbulb",
        "tags": "idea, glow, lamp",
        "group": "miscellaneous",
        "codepoint": 61995
    },
    {
        "displayName": "Glass",
        "iconName": "glass",
        "tags": "glassware, drink",
        "group": "miscellaneous",
        "codepoint": 61905
    },
    {
        "displayName": "Tint",
        "iconName": "tint",
        "tags": "drop, color, coloration, hue",
        "group": "media",
        "codepoint": 62197
    },
    {
        "displayName": "Flash",
        "iconName": "flash",
        "tags": "light, contrast, photograph, picture",
        "group": "media",
        "codepoint": 61872
    },
    {
        "displayName": "Font",
        "iconName": "font",
        "tags": "scale, typography, size",
        "group": "editor",
        "codepoint": 61887
    },
    {
        "displayName": "Header",
        "iconName": "header",
        "tags": "typography, section, layout",
        "group": "editor",
        "codepoint": 61925
    },
    {
        "displayName": "Saved",
        "iconName": "saved",
        "tags": "document, check mark, tick",
        "group": "file",
        "codepoint": 62109
    },
    {
        "displayName": "Floppy disk",
        "iconName": "floppy-disk",
        "tags": "save",
        "group": "interface",
        "codepoint": 61873
    },
    {
        "displayName": "Book",
        "iconName": "book",
        "tags": "pages, album, brochure, manual",
        "group": "miscellaneous",
        "codepoint": 61750
    },
    {
        "displayName": "Hand: right",
        "iconName": "hand-right",
        "tags": "gesture, direction",
        "group": "interface",
        "codepoint": 61918
    },
    {
        "displayName": "Hand: up",
        "iconName": "hand-up",
        "tags": "gesture, direction",
        "group": "interface",
        "codepoint": 61919
    },
    {
        "displayName": "Hand: down",
        "iconName": "hand-down",
        "tags": "gesture, direction",
        "group": "interface",
        "codepoint": 61916
    },
    {
        "displayName": "Hand: left",
        "iconName": "hand-left",
        "tags": "gesture, direction",
        "group": "interface",
        "codepoint": 61917
    },
    {
        "displayName": "Thumbs: up",
        "iconName": "thumbs-up",
        "tags": "hand, like, ok",
        "group": "interface",
        "codepoint": 62189
    },
    {
        "displayName": "Thumbs: down",
        "iconName": "thumbs-down",
        "tags": "hand, dislike, bad",
        "group": "interface",
        "codepoint": 62188
    },
    {
        "displayName": "Box",
        "iconName": "box",
        "tags": "folder, carton, pack",
        "group": "file",
        "codepoint": 61752
    },
    {
        "displayName": "Compressed",
        "iconName": "compressed",
        "tags": "folder, carton, pack, shrink, wrap, shorten",
        "group": "file",
        "codepoint": 61795
    },
    {
        "displayName": "Shopping cart",
        "iconName": "shopping-cart",
        "tags": "trolley, mall, online, store, business",
        "group": "miscellaneous",
        "codepoint": 62134
    },
    {
        "displayName": "Shop",
        "iconName": "shop",
        "tags": "store, business, shopping",
        "group": "miscellaneous",
        "codepoint": 62133
    },
    {
        "displayName": "Layout: linear",
        "iconName": "layout-linear",
        "tags": "dots, connection, line",
        "group": "data",
        "codepoint": 61986
    },
    {
        "displayName": "Undo",
        "iconName": "undo",
        "tags": "back, cancel, reverse, revoke,",
        "group": "action",
        "codepoint": 62210
    },
    {
        "displayName": "Redo",
        "iconName": "redo",
        "tags": "forward, push",
        "group": "action",
        "codepoint": 62088
    },
    {
        "displayName": "Code block",
        "iconName": "code-block",
        "tags": "code, markup, language, tag",
        "group": "file",
        "codepoint": 61787
    },
    {
        "displayName": "Double caret: vertical",
        "iconName": "double-caret-vertical",
        "tags": "sort, arrow, list",
        "group": "interface",
        "codepoint": 61828
    },
    {
        "displayName": "Double caret: horizontal",
        "iconName": "double-caret-horizontal",
        "tags": "sort, arrow, list",
        "group": "interface",
        "codepoint": 61827
    },
    {
        "displayName": "Sort: alphabetical descending",
        "iconName": "sort-alphabetical-desc",
        "tags": "order, list, array, arrange",
        "group": "action",
        "codepoint": 62145
    },
    {
        "displayName": "Sort: numerical descending",
        "iconName": "sort-numerical-desc",
        "tags": "order, list, array, arrange",
        "group": "action",
        "codepoint": 62149
    },
    {
        "displayName": "Take action",
        "iconName": "take-action",
        "tags": "case, court, deal, gavel",
        "group": "action",
        "codepoint": 62176
    },
    {
        "displayName": "Contrast",
        "iconName": "contrast",
        "tags": "color, brightness",
        "group": "media",
        "codepoint": 61798
    },
    {
        "displayName": "Eye: off",
        "iconName": "eye-off",
        "tags": "visibility, hide",
        "group": "interface",
        "codepoint": 61857
    },
    {
        "displayName": "Area chart",
        "iconName": "timeline-area-chart",
        "tags": "graph, line, diagram",
        "group": "data",
        "codepoint": 62193
    },
    {
        "displayName": "Doughnut chart",
        "iconName": "doughnut-chart",
        "tags": "circle, section, part, graph",
        "group": "data",
        "codepoint": 61833
    },
    {
        "displayName": "Layer",
        "iconName": "layer",
        "tags": "zone, level",
        "group": "interface",
        "codepoint": 61978
    },
    {
        "displayName": "Grid",
        "iconName": "grid",
        "tags": "layout, arrangement",
        "group": "data",
        "codepoint": 61913
    },
    {
        "displayName": "Polygon filter",
        "iconName": "polygon-filter",
        "tags": "shape, form",
        "group": "data",
        "codepoint": 62074
    },
    {
        "displayName": "Add to folder",
        "iconName": "add-to-folder",
        "tags": "file, portfolio, case, import",
        "group": "file",
        "codepoint": 61704
    },
    {
        "displayName": "Layout: balloon",
        "iconName": "layout-balloon",
        "tags": "layout, presentation, arrangement, graph",
        "group": "data",
        "codepoint": 61981
    },
    {
        "displayName": "Layout: sorted clusters",
        "iconName": "layout-sorted-clusters",
        "tags": "layout, presentation, arrangement, graph",
        "group": "data",
        "codepoint": 61988
    },
    {
        "displayName": "Sort: ascending",
        "iconName": "sort-asc",
        "tags": "order, list, array, arrange",
        "group": "action",
        "codepoint": 62147
    },
    {
        "displayName": "Sort: descending",
        "iconName": "sort-desc",
        "tags": "order, list, array, arrange",
        "group": "action",
        "codepoint": 62148
    },
    {
        "displayName": "Small cross",
        "iconName": "small-cross",
        "tags": "cross mark, fail, delete, no, close, remove",
        "group": "action",
        "codepoint": 62138
    },
    {
        "displayName": "Small tick",
        "iconName": "small-tick",
        "tags": "mark, sign, ok, approved, success",
        "group": "action",
        "codepoint": 62142
    },
    {
        "displayName": "Power",
        "iconName": "power",
        "tags": "button, on, off",
        "group": "media",
        "codepoint": 62075
    },
    {
        "displayName": "Column layout",
        "iconName": "column-layout",
        "tags": "layout, arrangement",
        "group": "table",
        "codepoint": 61791
    },
    {
        "displayName": "Arrow: top left",
        "iconName": "arrow-top-left",
        "tags": "direction, north west",
        "group": "interface",
        "codepoint": 61735
    },
    {
        "displayName": "Arrow: top right",
        "iconName": "arrow-top-right",
        "tags": "direction, north east",
        "group": "interface",
        "codepoint": 61736
    },
    {
        "displayName": "Arrow: bottom right",
        "iconName": "arrow-bottom-right",
        "tags": "direction, south east",
        "group": "interface",
        "codepoint": 61731
    },
    {
        "displayName": "Arrow: bottom left",
        "iconName": "arrow-bottom-left",
        "tags": "direction, south west",
        "group": "interface",
        "codepoint": 61730
    },
    {
        "displayName": "Mugshot",
        "iconName": "mugshot",
        "tags": "person, photograph, picture,",
        "group": "interface",
        "codepoint": 62029
    },
    {
        "displayName": "Headset",
        "iconName": "headset",
        "tags": "headphones, call, communication",
        "group": "media",
        "codepoint": 61926
    },
    {
        "displayName": "Text highlight",
        "iconName": "text-highlight",
        "tags": "selector, content",
        "group": "editor",
        "codepoint": 62181
    },
    {
        "displayName": "Hand",
        "iconName": "hand",
        "tags": "gesture, fingers",
        "group": "interface",
        "codepoint": 61920
    },
    {
        "displayName": "Chevron: backward",
        "iconName": "chevron-backward",
        "tags": "skip, direction",
        "group": "interface",
        "codepoint": 61769
    },
    {
        "displayName": "Chevron: forward",
        "iconName": "chevron-forward",
        "tags": "skip, direction",
        "group": "interface",
        "codepoint": 61771
    },
    {
        "displayName": "Rotate: document",
        "iconName": "rotate-document",
        "tags": "turn, anti clockwise",
        "group": "editor",
        "codepoint": 62105
    },
    {
        "displayName": "Rotate: page",
        "iconName": "rotate-page",
        "tags": "turn, anti clockwise",
        "group": "editor",
        "codepoint": 62106
    },
    {
        "displayName": "Badge",
        "iconName": "badge",
        "tags": "emblem, symbol, identification, insignia, marker",
        "group": "miscellaneous",
        "codepoint": 61743
    },
    {
        "displayName": "Grid view",
        "iconName": "grid-view",
        "tags": "layout, arrangement",
        "group": "editor",
        "codepoint": 61912
    },
    {
        "displayName": "Function",
        "iconName": "function",
        "tags": "math, calculation",
        "group": "table",
        "codepoint": 61893
    },
    {
        "displayName": "Waterfall chart",
        "iconName": "waterfall-chart",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 62230
    },
    {
        "displayName": "Stacked chart",
        "iconName": "stacked-chart",
        "tags": "bar chart",
        "group": "data",
        "codepoint": 62154
    },
    {
        "displayName": "Pulse",
        "iconName": "pulse",
        "tags": "medical, life, heartbeat, hospital",
        "group": "miscellaneous",
        "codepoint": 62084
    },
    {
        "displayName": "New person",
        "iconName": "new-person",
        "tags": "person, human, male, female, character, customer, individual, add",
        "group": "interface",
        "codepoint": 62039
    },
    {
        "displayName": "Exclude row",
        "iconName": "exclude-row",
        "tags": "delete, remove, table",
        "group": "table",
        "codepoint": 61854
    },
    {
        "displayName": "Pivot table",
        "iconName": "pivot-table",
        "tags": "rotate, axis",
        "group": "table",
        "codepoint": 62070
    },
    {
        "displayName": "Segmented control",
        "iconName": "segmented-control",
        "tags": "button, switch, option",
        "group": "interface",
        "codepoint": 62115
    },
    {
        "displayName": "Highlight",
        "iconName": "highlight",
        "tags": "select, text",
        "group": "action",
        "codepoint": 61935
    },
    {
        "displayName": "Filter: list",
        "iconName": "filter-list",
        "tags": "filtering, funnel, tube, pipe",
        "group": "action",
        "codepoint": 61866
    },
    {
        "displayName": "Cut",
        "iconName": "cut",
        "tags": "scissors",
        "group": "action",
        "codepoint": 61807
    },
    {
        "displayName": "Annotation",
        "iconName": "annotation",
        "tags": "note, comment, edit,",
        "group": "editor",
        "codepoint": 61717
    },
    {
        "displayName": "Pivot",
        "iconName": "pivot",
        "tags": "rotate, axis",
        "group": "action",
        "codepoint": 62071
    },
    {
        "displayName": "Ring",
        "iconName": "ring",
        "tags": "empty, circle, selection",
        "group": "miscellaneous",
        "codepoint": 62102
    },
    {
        "displayName": "Heat grid",
        "iconName": "heat-grid",
        "tags": "chart",
        "group": "data",
        "codepoint": 61929
    },
    {
        "displayName": "Gantt chart",
        "iconName": "gantt-chart",
        "tags": "bar chart, schedule, project",
        "group": "data",
        "codepoint": 61894
    },
    {
        "displayName": "Variable",
        "iconName": "variable",
        "tags": "math, calculation",
        "group": "table",
        "codepoint": 62219
    },
    {
        "displayName": "Manual",
        "iconName": "manual",
        "tags": "guide, instruction",
        "group": "interface",
        "codepoint": 62005
    },
    {
        "displayName": "Add row: top",
        "iconName": "add-row-top",
        "tags": "table, attach, join",
        "group": "table",
        "codepoint": 61702
    },
    {
        "displayName": "Add row: bottom",
        "iconName": "add-row-bottom",
        "tags": "table, attach, join",
        "group": "table",
        "codepoint": 61701
    },
    {
        "displayName": "Add column: left",
        "iconName": "add-column-left",
        "tags": "table, attach, join",
        "group": "table",
        "codepoint": 61698
    },
    {
        "displayName": "Add column: right",
        "iconName": "add-column-right",
        "tags": "table, attach, join",
        "group": "table",
        "codepoint": 61699
    },
    {
        "displayName": "Remove row: top",
        "iconName": "remove-row-top",
        "tags": "table, detach, delete",
        "group": "table",
        "codepoint": 62095
    },
    {
        "displayName": "Remove row: bottom",
        "iconName": "remove-row-bottom",
        "tags": "table, detach, delete",
        "group": "table",
        "codepoint": 62094
    },
    {
        "displayName": "Remove column: left",
        "iconName": "remove-column-left",
        "tags": "table, detach, delete",
        "group": "table",
        "codepoint": 62091
    },
    {
        "displayName": "Remove column: right",
        "iconName": "remove-column-right",
        "tags": "table, detach, delete",
        "group": "table",
        "codepoint": 62092
    },
    {
        "displayName": "Double chevron: left",
        "iconName": "double-chevron-left",
        "tags": "arrows, multiple, direction",
        "group": "interface",
        "codepoint": 61830
    },
    {
        "displayName": "Double chevron: right",
        "iconName": "double-chevron-right",
        "tags": "arrows, multiple, direction",
        "group": "interface",
        "codepoint": 61831
    },
    {
        "displayName": "Double chevron: up",
        "iconName": "double-chevron-up",
        "tags": "arrows, multiple, direction",
        "group": "interface",
        "codepoint": 61832
    },
    {
        "displayName": "Double chevron: down",
        "iconName": "double-chevron-down",
        "tags": "arrows, multiple, direction",
        "group": "interface",
        "codepoint": 61829
    },
    {
        "displayName": "Key: control",
        "iconName": "key-control",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61966
    },
    {
        "displayName": "Key: command",
        "iconName": "key-command",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61965
    },
    {
        "displayName": "Key: shift",
        "iconName": "key-shift",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61971
    },
    {
        "displayName": "Key: backspace",
        "iconName": "key-backspace",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61964
    },
    {
        "displayName": "Key: delete",
        "iconName": "key-delete",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61967
    },
    {
        "displayName": "Key: escape",
        "iconName": "key-escape",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61969
    },
    {
        "displayName": "Key: enter",
        "iconName": "key-enter",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61968
    },
    {
        "displayName": "Calculator",
        "iconName": "calculator",
        "tags": "math, device, value, numbers, total",
        "group": "miscellaneous",
        "codepoint": 61757
    },
    {
        "displayName": "Horizontal bar chart",
        "iconName": "horizontal-bar-chart",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 61940
    },
    {
        "displayName": "Small plus",
        "iconName": "small-plus",
        "tags": "sign, add, maximize, zoom in",
        "group": "action",
        "codepoint": 62140
    },
    {
        "displayName": "Small minus",
        "iconName": "small-minus",
        "tags": "sign, remove, minimize, zoom out",
        "group": "action",
        "codepoint": 62139
    },
    {
        "displayName": "Step chart",
        "iconName": "step-chart",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 62159
    },
    {
        "displayName": "Euro",
        "iconName": "euro",
        "tags": "currency, money",
        "group": "miscellaneous",
        "codepoint": 61852
    },
    {
        "displayName": "Drag handle: vertical",
        "iconName": "drag-handle-vertical",
        "tags": "move, pull",
        "group": "action",
        "codepoint": 61836
    },
    {
        "displayName": "Drag handle: horizontal",
        "iconName": "drag-handle-horizontal",
        "tags": "move, pull",
        "group": "action",
        "codepoint": 61835
    },
    {
        "displayName": "Mobile phone",
        "iconName": "mobile-phone",
        "tags": "cellular, device, call",
        "group": "media",
        "codepoint": 62021
    },
    {
        "displayName": "Sim card",
        "iconName": "sim-card",
        "tags": "phone, cellular",
        "group": "media",
        "codepoint": 62136
    },
    {
        "displayName": "Trending: up",
        "iconName": "trending-up",
        "tags": "growth, incline, progress",
        "group": "data",
        "codepoint": 62205
    },
    {
        "displayName": "Trending: down",
        "iconName": "trending-down",
        "tags": "decrease, decline, loss",
        "group": "data",
        "codepoint": 62204
    },
    {
        "displayName": "Curved range chart",
        "iconName": "curved-range-chart",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 61806
    },
    {
        "displayName": "Vertical bar chart: descending",
        "iconName": "vertical-bar-chart-desc",
        "tags": "graph, bar, histogram",
        "group": "data",
        "codepoint": 62221
    },
    {
        "displayName": "Horizontal bar chart: descending",
        "iconName": "horizontal-bar-chart-desc",
        "tags": "graph, bar, histogram",
        "group": "data",
        "codepoint": 61939
    },
    {
        "displayName": "Document: open",
        "iconName": "document-open",
        "tags": "paper, access",
        "group": "file",
        "codepoint": 61822
    },
    {
        "displayName": "Document: share",
        "iconName": "document-share",
        "tags": "paper, send",
        "group": "file",
        "codepoint": 61823
    },
    {
        "displayName": "Distribution: horizontal",
        "iconName": "horizontal-distribution",
        "tags": "alignment, layout, position",
        "group": "editor",
        "codepoint": 61941
    },
    {
        "displayName": "Distribution: vertical",
        "iconName": "vertical-distribution",
        "tags": "alignment, layout, position",
        "group": "editor",
        "codepoint": 62222
    },
    {
        "displayName": "Alignment: left",
        "iconName": "alignment-left",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61713
    },
    {
        "displayName": "Alignment: vertical center",
        "iconName": "alignment-vertical-center",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61716
    },
    {
        "displayName": "Alignment: right",
        "iconName": "alignment-right",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61714
    },
    {
        "displayName": "Alignment: top",
        "iconName": "alignment-top",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61715
    },
    {
        "displayName": "Alignment: horizontal center",
        "iconName": "alignment-horizontal-center",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61712
    },
    {
        "displayName": "Alignment: bottom",
        "iconName": "alignment-bottom",
        "tags": "layout, position",
        "group": "editor",
        "codepoint": 61711
    },
    {
        "displayName": "Git: pull",
        "iconName": "git-pull",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61902
    },
    {
        "displayName": "Git: merge",
        "iconName": "git-merge",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61900
    },
    {
        "displayName": "Git: branch",
        "iconName": "git-branch",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61898
    },
    {
        "displayName": "Git: commit",
        "iconName": "git-commit",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61899
    },
    {
        "displayName": "Git: push",
        "iconName": "git-push",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61903
    },
    {
        "displayName": "Build",
        "iconName": "build",
        "tags": "hammer, tool",
        "group": "action",
        "codepoint": 61756
    },
    {
        "displayName": "Symbol: circle",
        "iconName": "symbol-circle",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62168
    },
    {
        "displayName": "Symbol: square",
        "iconName": "symbol-square",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62171
    },
    {
        "displayName": "Symbol: diamond",
        "iconName": "symbol-diamond",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62170
    },
    {
        "displayName": "Symbol: cross",
        "iconName": "symbol-cross",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62169
    },
    {
        "displayName": "Symbol: triangle up",
        "iconName": "symbol-triangle-up",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62173
    },
    {
        "displayName": "Symbol: triangle down",
        "iconName": "symbol-triangle-down",
        "tags": "shape, figure",
        "group": "interface",
        "codepoint": 62172
    },
    {
        "displayName": "Wrench",
        "iconName": "wrench",
        "tags": "tool, repair",
        "group": "miscellaneous",
        "codepoint": 62237
    },
    {
        "displayName": "Application",
        "iconName": "application",
        "tags": "application, browser, windows, platform",
        "group": "interface",
        "codepoint": 61720
    },
    {
        "displayName": "Send to graph",
        "iconName": "send-to-graph",
        "tags": "transfer, move",
        "group": "action",
        "codepoint": 62119
    },
    {
        "displayName": "Send to map",
        "iconName": "send-to-map",
        "tags": "transfer, move",
        "group": "action",
        "codepoint": 62120
    },
    {
        "displayName": "Join table",
        "iconName": "join-table",
        "tags": "combine, attach, connect, link, unite",
        "group": "table",
        "codepoint": 61963
    },
    {
        "displayName": "Derive column",
        "iconName": "derive-column",
        "tags": "table, obtain, get, take, develop",
        "group": "action",
        "codepoint": 61815
    },
    {
        "displayName": "Rotate image: left",
        "iconName": "image-rotate-left",
        "tags": "picture, turn, alternate",
        "group": "media",
        "codepoint": 61944
    },
    {
        "displayName": "Rotate image: right",
        "iconName": "image-rotate-right",
        "tags": "picture, turn, alternate",
        "group": "media",
        "codepoint": 61945
    },
    {
        "displayName": "Known vehicle",
        "iconName": "known-vehicle",
        "tags": "car, automobile, vehicle, van, drive, ride, distance, navigation, directions",
        "group": "interface",
        "codepoint": 61974
    },
    {
        "displayName": "Unknown vehicle",
        "iconName": "unknown-vehicle",
        "tags": "car, automobile, vehicle, van, drive, ride, distance, navigation, directions",
        "group": "interface",
        "codepoint": 62212
    },
    {
        "displayName": "Scatter plot",
        "iconName": "scatter-plot",
        "tags": "graph, diagram",
        "group": "data",
        "codepoint": 62110
    },
    {
        "displayName": "Oil field",
        "iconName": "oil-field",
        "tags": "fuel, petroleum, gas, well, drilling, pump",
        "group": "interface",
        "codepoint": 62051
    },
    {
        "displayName": "Rig",
        "iconName": "rig",
        "tags": "fuel, petroleum, gas, well, drilling",
        "group": "interface",
        "codepoint": 62100
    },
    {
        "displayName": "New map",
        "iconName": "map-create",
        "tags": "map, location, position, geography, world",
        "group": "interface",
        "codepoint": 62009
    },
    {
        "displayName": "Key: option",
        "iconName": "key-option",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61970
    },
    {
        "displayName": "List: detail view",
        "iconName": "list-detail-view",
        "tags": "agenda, four lines, table",
        "group": "table",
        "codepoint": 61999
    },
    {
        "displayName": "Swap: vertical",
        "iconName": "swap-vertical",
        "tags": "direction, position, opposite, inverse",
        "group": "interface",
        "codepoint": 62166
    },
    {
        "displayName": "Swap: horizontal",
        "iconName": "swap-horizontal",
        "tags": "direction, position, opposite, inverse",
        "group": "interface",
        "codepoint": 62165
    },
    {
        "displayName": "Numbered list",
        "iconName": "numbered-list",
        "tags": "order, list, array, arrange",
        "group": "action",
        "codepoint": 62047
    },
    {
        "displayName": "New grid item",
        "iconName": "new-grid-item",
        "tags": "layout, arrangement, add",
        "group": "editor",
        "codepoint": 62034
    },
    {
        "displayName": "Git: repo",
        "iconName": "git-repo",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61904
    },
    {
        "displayName": "Git: new branch",
        "iconName": "git-new-branch",
        "tags": "github, repository, code, command",
        "group": "action",
        "codepoint": 61901
    },
    {
        "displayName": "Manually entered data",
        "iconName": "manually-entered-data",
        "tags": "input, human",
        "group": "editor",
        "codepoint": 62006
    },
    {
        "displayName": "Airplane",
        "iconName": "airplane",
        "tags": "flight, jet, travel, trip, transport, take-off",
        "group": "interface",
        "codepoint": 61706
    },
    {
        "displayName": "Merge columns",
        "iconName": "merge-columns",
        "tags": "layout, change, two, combine, unite",
        "group": "table",
        "codepoint": 62017
    },
    {
        "displayName": "Split columns",
        "iconName": "split-columns",
        "tags": "layout, change, two, break, divide",
        "group": "table",
        "codepoint": 62152
    },
    {
        "displayName": "Dashboard",
        "iconName": "dashboard",
        "tags": "panel, control, gauge, instrument, meter",
        "group": "interface",
        "codepoint": 61809
    },
    {
        "displayName": "Publish function",
        "iconName": "publish-function",
        "tags": "math, calculation, share",
        "group": "table",
        "codepoint": 62083
    },
    {
        "displayName": "Path",
        "iconName": "path",
        "tags": "hierarchy, trail, steps",
        "group": "interface",
        "codepoint": 62062
    },
    {
        "displayName": "Moon",
        "iconName": "moon",
        "tags": "night, sky, dark",
        "group": "miscellaneous",
        "codepoint": 62025
    },
    {
        "displayName": "Remove column",
        "iconName": "remove-column",
        "tags": "table, detach, delete",
        "group": "table",
        "codepoint": 62093
    },
    {
        "displayName": "Numerical",
        "iconName": "numerical",
        "tags": "numbers, order, sort, arrange, array",
        "group": "action",
        "codepoint": 62048
    },
    {
        "displayName": "Key: tab",
        "iconName": "key-tab",
        "tags": "interface, shortcuts, buttons",
        "group": "media",
        "codepoint": 61972
    },
    {
        "displayName": "Regression chart",
        "iconName": "regression-chart",
        "tags": "graph, line, chart",
        "group": "data",
        "codepoint": 62090
    },
    {
        "displayName": "Translate",
        "iconName": "translate",
        "tags": "language, convert",
        "group": "action",
        "codepoint": 62201
    },
    {
        "displayName": "Eye: on",
        "iconName": "eye-on",
        "tags": "visibility, show",
        "group": "interface",
        "codepoint": 61858
    },
    {
        "displayName": "Vertical bar chart: ascending",
        "iconName": "vertical-bar-chart-asc",
        "tags": "graph, bar, histogram",
        "group": "data",
        "codepoint": 62220
    },
    {
        "displayName": "Horizontal bar chart: ascending",
        "iconName": "horizontal-bar-chart-asc",
        "tags": "graph, bar, histogram",
        "group": "data",
        "codepoint": 61938
    },
    {
        "displayName": "Grouped bar chart",
        "iconName": "grouped-bar-chart",
        "tags": "graph, bar, chart",
        "group": "data",
        "codepoint": 61915
    },
    {
        "displayName": "Full stacked chart",
        "iconName": "full-stacked-chart",
        "tags": "graph, bar, chart",
        "group": "data",
        "codepoint": 61891
    },
    {
        "displayName": "Endorsed",
        "iconName": "endorsed",
        "tags": "tick, mark, sign, ok, approved, success",
        "group": "action",
        "codepoint": 61847
    },
    {
        "displayName": "Follower",
        "iconName": "follower",
        "tags": "person, human, male, female, character, customer, individual, social",
        "group": "interface",
        "codepoint": 61885
    },
    {
        "displayName": "Following",
        "iconName": "following",
        "tags": "person, human, male, female, character, customer, individual, social",
        "group": "interface",
        "codepoint": 61886
    },
    {
        "displayName": "Menu",
        "iconName": "menu",
        "tags": "navigation, lines, list",
        "group": "interface",
        "codepoint": 62016
    },
    {
        "displayName": "Collapse all",
        "iconName": "collapse-all",
        "tags": "arrows, chevron, reduce",
        "group": "interface",
        "codepoint": 61790
    },
    {
        "displayName": "Expand all",
        "iconName": "expand-all",
        "tags": "arrows, chevron, enlarge",
        "group": "interface",
        "codepoint": 61855
    },
    {
        "displayName": "Intersection",
        "iconName": "intersection",
        "tags": "circles, combine, cross",
        "group": "action",
        "codepoint": 61957
    },
    {
        "displayName": "Blocked person",
        "iconName": "blocked-person",
        "tags": "person, human, male, female, character, customer, individual, social, banned, prohibited",
        "group": "interface",
        "codepoint": 61748
    },
    {
        "displayName": "Slash",
        "iconName": "slash",
        "tags": "divide, separate",
        "group": "action",
        "codepoint": 62137
    },
    {
        "displayName": "Percentage",
        "iconName": "percentage",
        "tags": "modulo, modulus",
        "group": "action",
        "codepoint": 62065
    },
    {
        "displayName": "Satellite",
        "iconName": "satellite",
        "tags": "communication, space",
        "group": "miscellaneous",
        "codepoint": 62108
    },
    {
        "displayName": "Paragraph",
        "iconName": "paragraph",
        "tags": "text, chapter, division, part",
        "group": "editor",
        "codepoint": 62060
    },
    {
        "displayName": "Bank account",
        "iconName": "bank-account",
        "tags": "money, finance, funds",
        "group": "miscellaneous",
        "codepoint": 61745
    },
    {
        "displayName": "Cell tower",
        "iconName": "cell-tower",
        "tags": "signal, communication, radio, mast",
        "group": "miscellaneous",
        "codepoint": 61765
    },
    {
        "displayName": "ID number",
        "iconName": "id-number",
        "tags": "identification, person, document",
        "group": "miscellaneous",
        "codepoint": 61943
    },
    {
        "displayName": "IP address",
        "iconName": "ip-address",
        "tags": "internet, protocol, number, id, network",
        "group": "miscellaneous",
        "codepoint": 61958
    },
    {
        "displayName": "Eraser",
        "iconName": "eraser",
        "tags": "delete, remove",
        "group": "editor",
        "codepoint": 61850
    },
    {
        "displayName": "Issue",
        "iconName": "issue",
        "tags": "circle, notification, failure, circle, exclamation mark, sign, problem",
        "group": "interface",
        "codepoint": 61961
    },
    {
        "displayName": "Issue: new",
        "iconName": "issue-new",
        "tags": "circle, notification, failure, circle, exclamation mark, sign, problem",
        "group": "interface",
        "codepoint": 61960
    },
    {
        "displayName": "Issue: closed",
        "iconName": "issue-closed",
        "tags": "circle, notification, failure, circle, exclamation mark, sign, problem",
        "group": "interface",
        "codepoint": 61959
    },
    {
        "displayName": "Panel: stats",
        "iconName": "panel-stats",
        "tags": "sidebar, layout, list",
        "group": "table",
        "codepoint": 62057
    },
    {
        "displayName": "Panel: table",
        "iconName": "panel-table",
        "tags": "sidebar, layout, spreadsheet",
        "group": "table",
        "codepoint": 62058
    },
    {
        "displayName": "Tick circle",
        "iconName": "tick-circle",
        "tags": "mark, sign, ok, approved, success",
        "group": "action",
        "codepoint": 62190
    },
    {
        "displayName": "Prescription",
        "iconName": "prescription",
        "tags": "instruction, direction, medicine, drug, medication, mixture",
        "group": "miscellaneous",
        "codepoint": 62077
    },
    {
        "displayName": "Prescription: new",
        "iconName": "new-prescription",
        "tags": "instruction, direction, medicine, drug, medication, mixture",
        "group": "miscellaneous",
        "codepoint": 62040
    },
    {
        "displayName": "Filter: keep",
        "iconName": "filter-keep",
        "tags": "filtering, funnel, tube, pipe, retain, stay",
        "group": "action",
        "codepoint": 61865
    },
    {
        "displayName": "Filter: remove",
        "iconName": "filter-remove",
        "tags": "filtering, funnel, tube, pipe, delete, detach, discard, dismiss",
        "group": "action",
        "codepoint": 61868
    },
    {
        "displayName": "Key",
        "iconName": "key",
        "tags": "lock, unlock, open, security, password, access",
        "group": "interface",
        "codepoint": 61973
    },
    {
        "displayName": "Feed: subscribed",
        "iconName": "feed-subscribed",
        "tags": "rss, feed, tick, check",
        "group": "interface",
        "codepoint": 61862
    },
    {
        "displayName": "Widget: button",
        "iconName": "widget-button",
        "tags": "element, click, press",
        "group": "interface",
        "codepoint": 62232
    },
    {
        "displayName": "Widget: header",
        "iconName": "widget-header",
        "tags": "element, layout, top",
        "group": "interface",
        "codepoint": 62234
    },
    {
        "displayName": "Widget: footer",
        "iconName": "widget-footer",
        "tags": "element, layout, bottom",
        "group": "interface",
        "codepoint": 62233
    },
    {
        "displayName": "Header: one",
        "iconName": "header-one",
        "tags": "paragraph styling, formatting",
        "group": "editor",
        "codepoint": 61922
    },
    {
        "displayName": "Header: two",
        "iconName": "header-two",
        "tags": "paragraph styling, formatting",
        "group": "editor",
        "codepoint": 61924
    },
    {
        "displayName": "Form",
        "iconName": "form",
        "tags": "response, fill",
        "group": "data",
        "codepoint": 61889
    },
    {
        "displayName": "Series: add",
        "iconName": "series-add",
        "tags": "timeseries, plot, line, data, chart, new, create",
        "group": "data",
        "codepoint": 62122
    },
    {
        "displayName": "Series: search",
        "iconName": "series-search",
        "tags": "timeseries, plot, line, data, chart, find, filter",
        "group": "data",
        "codepoint": 62126
    },
    {
        "displayName": "Series: filtered",
        "iconName": "series-filtered",
        "tags": "timeseries, plot, line, data, chart, reduce, reduced, search",
        "group": "data",
        "codepoint": 62125
    },
    {
        "displayName": "Series: derived",
        "iconName": "series-derived",
        "tags": "timeseries, plot, line, data, chart, transform, transformed, compute, computed, modify, modified, alter, altered, adjust, adjusted",
        "group": "data",
        "codepoint": 62124
    },
    {
        "displayName": "Series: configuration",
        "iconName": "series-configuration",
        "tags": " timeseries, plot, line, data, chart, edit, modify, customize, adjust, alter, transform",
        "group": "data",
        "codepoint": 62123
    },
    {
        "displayName": "Console",
        "iconName": "console",
        "tags": "terminal, coding",
        "group": "interface",
        "codepoint": 61797
    },
    {
        "displayName": "Compass",
        "iconName": "compass",
        "tags": "map, direction",
        "group": "interface",
        "codepoint": 61794
    },
    {
        "displayName": "Walk",
        "iconName": "walk",
        "tags": "transportation, run, move",
        "group": "interface",
        "codepoint": 62228
    },
    {
        "displayName": "Taxi",
        "iconName": "taxi",
        "tags": "transportation, car, move",
        "group": "interface",
        "codepoint": 62179
    },
    {
        "displayName": "Train",
        "iconName": "train",
        "tags": "transportation, public, move",
        "group": "interface",
        "codepoint": 62200
    },
    {
        "displayName": "Heart: broken",
        "iconName": "heart-broken",
        "tags": "love, like, organ, human, feelings, split, torn, failed, health",
        "group": "miscellaneous",
        "codepoint": 61927
    },
    {
        "displayName": "Join: inner",
        "iconName": "inner-join",
        "tags": "circles, combine, connect, add, part, slice",
        "group": "action",
        "codepoint": 61955
    },
    {
        "displayName": "Join: left",
        "iconName": "left-join",
        "tags": "circles, combine, connect, add, part, slice",
        "group": "action",
        "codepoint": 61991
    },
    {
        "displayName": "Join: right",
        "iconName": "right-join",
        "tags": "circles, combine, connect, add, part, slice",
        "group": "action",
        "codepoint": 62101
    },
    {
        "displayName": "Strikethrough",
        "iconName": "strikethrough",
        "tags": "typography, text, font-style, line, removed",
        "group": "editor",
        "codepoint": 62163
    },
    {
        "displayName": "Updated",
        "iconName": "updated",
        "tags": "time, recent, success",
        "group": "interface",
        "codepoint": 62216
    },
    {
        "displayName": "Outdated",
        "iconName": "outdated",
        "tags": "time, error, warning",
        "group": "interface",
        "codepoint": 62055
    },
    {
        "displayName": "Flame",
        "iconName": "flame",
        "tags": "fire, trendy, hot, popular",
        "group": "miscellaneous",
        "codepoint": 61871
    },
    {
        "displayName": "Folder: new",
        "iconName": "folder-new",
        "tags": "create, group, organize, sort",
        "group": "file",
        "codepoint": 61881
    },
    {
        "displayName": "Mountain",
        "iconName": "mountain",
        "tags": "summit, climb, peak",
        "group": "miscellaneous",
        "codepoint": 62027
    },
    {
        "displayName": "Shield",
        "iconName": "shield",
        "tags": "protect, protection, secure, security, safe, safety, privacy, marking, control",
        "group": "miscellaneous",
        "codepoint": 62131
    },
    {
        "displayName": "Tree diagram",
        "iconName": "diagram-tree",
        "tags": "organization, chart, hierarchy, relationship, reference",
        "group": "data",
        "codepoint": 61818
    },
    {
        "displayName": "Crown",
        "iconName": "crown",
        "tags": "crown, hat, role, level, permission, king",
        "group": "miscellaneous",
        "codepoint": 61802
    },
    {
        "displayName": "Globe: network",
        "iconName": "globe-network",
        "tags": "planet, earth, map, world, www, website",
        "group": "miscellaneous",
        "codepoint": 61906
    },
    {
        "displayName": "Snowflake",
        "iconName": "snowflake",
        "tags": "weather, winter, freeze, ice",
        "group": "miscellaneous",
        "codepoint": 62143
    },
    {
        "displayName": "Tree",
        "iconName": "tree",
        "tags": "forest, wood, landmark",
        "group": "miscellaneous",
        "codepoint": 62203
    },
    {
        "displayName": "Notifications: updated",
        "iconName": "notifications-updated",
        "tags": "notifications, bell, alarm, notice, warning",
        "group": "interface",
        "codepoint": 62045
    },
    {
        "displayName": "List: columns",
        "iconName": "list-columns",
        "tags": "layout, arrangement, four lines, table",
        "group": "table",
        "codepoint": 61998
    },
    {
        "displayName": "Flow: linear",
        "iconName": "flow-linear",
        "tags": "workflow, edge, node, step",
        "group": "data",
        "codepoint": 61876
    },
    {
        "displayName": "Flow: branch",
        "iconName": "flow-branch",
        "tags": "workflow, edge, node, fork",
        "group": "data",
        "codepoint": 61874
    },
    {
        "displayName": "Flow: review",
        "iconName": "flow-review",
        "tags": "workflow, edge, node, reverse",
        "group": "data",
        "codepoint": 61878
    },
    {
        "displayName": "Flow: review branch",
        "iconName": "flow-review-branch",
        "tags": "workflow, edge, node, fork",
        "group": "data",
        "codepoint": 61877
    },
    {
        "displayName": "Flow: end",
        "iconName": "flow-end",
        "tags": "workflow, edge, node, complete, finished, final, last",
        "group": "data",
        "codepoint": 61875
    },
    {
        "displayName": "Clean",
        "iconName": "clean",
        "tags": "correct, cleanse, clear, purify, stars",
        "group": "action",
        "codepoint": 61781
    },
    {
        "displayName": "Table: filtered",
        "iconName": "th-filtered",
        "tags": "index, rows, columns, agenda, list, spreadsheet, filtering, funnel",
        "group": "table",
        "codepoint": 62184
    },
    {
        "displayName": "Lifesaver",
        "iconName": "lifesaver",
        "tags": "help, support, aid, advice",
        "group": "miscellaneous",
        "codepoint": 61994
    },
    {
        "displayName": "Cube",
        "iconName": "cube",
        "tags": "shape, 3d, object",
        "group": "miscellaneous",
        "codepoint": 61805
    },
    {
        "displayName": "Cube: add",
        "iconName": "cube-add",
        "tags": "shape, 3d, object",
        "group": "miscellaneous",
        "codepoint": 61803
    },
    {
        "displayName": "Cube: remove",
        "iconName": "cube-remove",
        "tags": "shape, 3d, object",
        "group": "miscellaneous",
        "codepoint": 61804
    },
    {
        "displayName": "Inbox: filtered",
        "iconName": "inbox-filtered",
        "tags": "folder, mail, file, message, funnel",
        "group": "file",
        "codepoint": 61947
    },
    {
        "displayName": "Inbox: geo",
        "iconName": "inbox-geo",
        "tags": "folder, mail, file, message, geography, location, area, globe",
        "group": "file",
        "codepoint": 61948
    },
    {
        "displayName": "Inbox: search",
        "iconName": "inbox-search",
        "tags": "folder, mail, file, message, inspection, exploration, magnifying glass",
        "group": "file",
        "codepoint": 61949
    },
    {
        "displayName": "Inbox: update",
        "iconName": "inbox-update",
        "tags": "folder, mail, file, message, notifications, warning",
        "group": "file",
        "codepoint": 61950
    },
    {
        "displayName": "Inheritance",
        "iconName": "inheritance",
        "tags": "arrows, derive",
        "group": "action",
        "codepoint": 61953
    },
    {
        "displayName": "Reset",
        "iconName": "reset",
        "tags": "circle, arrow",
        "group": "action",
        "codepoint": 62098
    },
    {
        "displayName": "Filter: open",
        "iconName": "filter-open",
        "tags": "filtering, funnel, tube, pipe",
        "group": "action",
        "codepoint": 61867
    },
    {
        "displayName": "Table: disconnect",
        "iconName": "th-disconnect",
        "tags": "index, rows, columns, agenda, list, spreadsheet, unlink, detach, remove",
        "group": "table",
        "codepoint": 62183
    },
    {
        "displayName": "Equals",
        "iconName": "equals",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 61849
    },
    {
        "displayName": "Not equal to",
        "iconName": "not-equal-to",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 62043
    },
    {
        "displayName": "Greater than",
        "iconName": "greater-than",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 61911
    },
    {
        "displayName": "Greater than or equal to",
        "iconName": "greater-than-or-equal-to",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 61910
    },
    {
        "displayName": "Less than",
        "iconName": "less-than",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 61993
    },
    {
        "displayName": "Less than or equal to",
        "iconName": "less-than-or-equal-to",
        "tags": "mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 61992
    },
    {
        "displayName": "Learning",
        "iconName": "learning",
        "tags": "tutorial, learn, teach",
        "group": "miscellaneous",
        "codepoint": 61990
    },
    {
        "displayName": "New layer",
        "iconName": "new-layer",
        "tags": "layers, levels, stack, cards",
        "group": "interface",
        "codepoint": 62035
    },
    {
        "displayName": "New layers",
        "iconName": "new-layers",
        "tags": "layers, levels, stack, cards",
        "group": "interface",
        "codepoint": 62036
    },
    {
        "displayName": "Stopwatch",
        "iconName": "stopwatch",
        "tags": "clock, day, hours, minutes, seconds",
        "group": "interface",
        "codepoint": 62162
    },
    {
        "displayName": "Archive",
        "iconName": "archive",
        "tags": "compress, compression, zip, bundle",
        "group": "action",
        "codepoint": 61722
    },
    {
        "displayName": "Unarchive",
        "iconName": "unarchive",
        "tags": "compress, compression, zip, bundle, uncompress, unzip, unbundle",
        "group": "action",
        "codepoint": 62208
    },
    {
        "displayName": "Data lineage",
        "iconName": "data-lineage",
        "tags": "flow, rectangle, graph, downstream, upstream, propagation",
        "group": "interface",
        "codepoint": 61811
    },
    {
        "displayName": "New drawing",
        "iconName": "new-drawing",
        "tags": "selection, area, highlight, sketch",
        "group": "interface",
        "codepoint": 62033
    },
    {
        "displayName": "Signal search",
        "iconName": "signal-search",
        "tags": "signal, communication, radio, mast",
        "group": "action",
        "codepoint": 62135
    },
    {
        "displayName": "Bring in data",
        "iconName": "bring-data",
        "tags": "copy, duplicate, add, data, bring",
        "group": "action",
        "codepoint": 61754
    },
    {
        "displayName": "Tractor",
        "iconName": "tractor",
        "tags": "tractor, automobile, vehicle, farm, farming",
        "group": "interface",
        "codepoint": 62199
    },
    {
        "displayName": "Truck",
        "iconName": "truck",
        "tags": "truck, automobile, vehicle, car, van, drive, ride, distance, navigation, directions",
        "group": "interface",
        "codepoint": 62206
    },
    {
        "displayName": "Diagnosis",
        "iconName": "diagnosis",
        "tags": "doctor, science, heart, stethoscope, medical, examination",
        "group": "interface",
        "codepoint": 61817
    },
    {
        "displayName": "Lab test",
        "iconName": "lab-test",
        "tags": "science, beaker, chemistry, mixing, scientist",
        "group": "interface",
        "codepoint": 61975
    },
    {
        "displayName": "Virus",
        "iconName": "virus",
        "tags": "virus, doctor, medical, examination, disease, pandemic, sick",
        "group": "interface",
        "codepoint": 62224
    },
    {
        "displayName": "Inherited group membership",
        "iconName": "inherited-group",
        "tags": "group, inheritance, inherited, membership, people",
        "group": "interface",
        "codepoint": 61954
    },
    {
        "displayName": "Hat",
        "iconName": "hat",
        "tags": "head, clothing, cap, fedora, role, level, permission",
        "group": "miscellaneous",
        "codepoint": 61921
    },
    {
        "displayName": "Cycle",
        "iconName": "cycle",
        "tags": "cycle, bike, cyclist, biker, ride, rider, transportation",
        "group": "interface",
        "codepoint": 61808
    },
    {
        "displayName": "Route",
        "iconName": "route",
        "tags": "route, destination, travel, journey, road, transportation",
        "group": "interface",
        "codepoint": 62107
    },
    {
        "displayName": "Modal",
        "iconName": "modal",
        "tags": "modal, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 62024
    },
    {
        "displayName": "Modal filled",
        "iconName": "modal-filled",
        "tags": "modal, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 62023
    },
    {
        "displayName": "Drawer left",
        "iconName": "drawer-left",
        "tags": "drawer, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 61839
    },
    {
        "displayName": "Drawer left filled",
        "iconName": "drawer-left-filled",
        "tags": "drawer, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 61838
    },
    {
        "displayName": "Drawer right",
        "iconName": "drawer-right",
        "tags": "drawer, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 61841
    },
    {
        "displayName": "Drawer right filled",
        "iconName": "drawer-right-filled",
        "tags": "drawer, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 61840
    },
    {
        "displayName": "Application header",
        "iconName": "app-header",
        "tags": "header, application, layout, user-interface, UI",
        "group": "interface",
        "codepoint": 61719
    },
    {
        "displayName": "Send message",
        "iconName": "send-message",
        "tags": "send, deliver, paper-airplane, post",
        "group": "action",
        "codepoint": 62118
    },
    {
        "displayName": "Backlink",
        "iconName": "backlink",
        "tags": "link, backlink, back",
        "group": "interface",
        "codepoint": 61742
    },
    {
        "displayName": "Geofence",
        "iconName": "geofence",
        "tags": "region, geo, fence",
        "group": "interface",
        "codepoint": 61895
    },
    {
        "displayName": "Data Connection",
        "iconName": "data-connection",
        "tags": "connectivity, connection, database, data, status, health",
        "group": "interface",
        "codepoint": 61810
    },
    {
        "displayName": "Switch",
        "iconName": "switch",
        "tags": "switch, electric, electrical",
        "group": "miscellaneous",
        "codepoint": 62167
    },
    {
        "displayName": "Array",
        "iconName": "array",
        "tags": "array",
        "group": "miscellaneous",
        "codepoint": 61729
    },
    {
        "displayName": "Boolean Array",
        "iconName": "array-boolean",
        "tags": "array, boolean",
        "group": "miscellaneous",
        "codepoint": 61724
    },
    {
        "displayName": "Date Array",
        "iconName": "array-date",
        "tags": "array, date",
        "group": "miscellaneous",
        "codepoint": 61725
    },
    {
        "displayName": "Numeric Array",
        "iconName": "array-numeric",
        "tags": "array, numeric, number",
        "group": "miscellaneous",
        "codepoint": 61726
    },
    {
        "displayName": "String Array",
        "iconName": "array-string",
        "tags": "array, string",
        "group": "miscellaneous",
        "codepoint": 61727
    },
    {
        "displayName": "Timestamp Array",
        "iconName": "array-timestamp",
        "tags": "array, timestamp",
        "group": "miscellaneous",
        "codepoint": 61728
    },
    {
        "displayName": "Layer Outline",
        "iconName": "layer-outline",
        "tags": "zone, level, outline",
        "group": "interface",
        "codepoint": 61977
    },
    {
        "displayName": "Notifications: snooze",
        "iconName": "notifications-snooze",
        "tags": "notification, information, message, snooze, suppress",
        "group": "interface",
        "codepoint": 62044
    },
    {
        "displayName": "High Priority",
        "iconName": "high-priority",
        "tags": "notification, message",
        "group": "interface",
        "codepoint": 61934
    },
    {
        "displayName": "Emoji",
        "iconName": "emoji",
        "tags": "message, chat, reaction",
        "group": "interface",
        "codepoint": 61846
    },
    {
        "displayName": "Add Location",
        "iconName": "add-location",
        "tags": "location, add,",
        "group": "interface",
        "codepoint": 61700
    },
    {
        "displayName": "Shapes",
        "iconName": "shapes",
        "tags": "shapes, geometric,",
        "group": "interface",
        "codepoint": 62128
    },
    {
        "displayName": "Shared Filter",
        "iconName": "shared-filter",
        "tags": "notification, filter, shared",
        "group": "interface",
        "codepoint": 62130
    },
    {
        "displayName": "One to one",
        "iconName": "one-to-one",
        "tags": "object, relation, ontology",
        "group": "data",
        "codepoint": 62054
    },
    {
        "displayName": "One to many",
        "iconName": "one-to-many",
        "tags": "object, relation, ontology",
        "group": "data",
        "codepoint": 62053
    },
    {
        "displayName": "Many to one",
        "iconName": "many-to-one",
        "tags": "object, relation, ontology",
        "group": "data",
        "codepoint": 62008
    },
    {
        "displayName": "Many to many",
        "iconName": "many-to-many",
        "tags": "object, relation, ontology",
        "group": "data",
        "codepoint": 62007
    },
    {
        "displayName": "Geometry: Stadium",
        "iconName": "stadium-geometry",
        "tags": "geometry, shape, race track, ellipse, discorectangle, obround",
        "group": "miscellaneous",
        "codepoint": 62155
    },
    {
        "displayName": "Area of interest",
        "iconName": "area-of-interest",
        "tags": "NAI, named area, location",
        "group": "interface",
        "codepoint": 61723
    },
    {
        "displayName": "Buggy",
        "iconName": "buggy",
        "tags": "vehicle, car, transportation",
        "group": "interface",
        "codepoint": 61755
    },
    {
        "displayName": "Antenna",
        "iconName": "antenna",
        "tags": "antenna, signal, communication",
        "group": "miscellaneous",
        "codepoint": 61718
    },
    {
        "displayName": "Tank",
        "iconName": "tank",
        "tags": "tank, automobile, vehicle, armored",
        "group": "interface",
        "codepoint": 62177
    },
    {
        "displayName": "Third Party",
        "iconName": "third-party",
        "tags": "third party, external",
        "group": "interface",
        "codepoint": 62187
    },
    {
        "displayName": "Rocket",
        "iconName": "rocket",
        "tags": "rocket, fly, space",
        "group": "miscellaneous",
        "codepoint": 62104
    },
    {
        "displayName": "Rocket (slanted)",
        "iconName": "rocket-slant",
        "tags": "rocket, fly, space",
        "group": "miscellaneous",
        "codepoint": 62103
    },
    {
        "displayName": "Header: three",
        "iconName": "header-three",
        "tags": "paragraph styling, formatting",
        "group": "editor",
        "codepoint": 61923
    },
    {
        "displayName": "Helicopter",
        "iconName": "helicopter",
        "tags": "helicopter, chopper, fly",
        "group": "miscellaneous",
        "codepoint": 61931
    },
    {
        "displayName": "Syringe",
        "iconName": "syringe",
        "tags": "syringe, vaccine, shot, medicine",
        "group": "miscellaneous",
        "codepoint": 62174
    },
    {
        "displayName": "Temperature",
        "iconName": "temperature",
        "tags": "thermometer, climate, weather",
        "group": "miscellaneous",
        "codepoint": 62180
    },
    {
        "displayName": "Waves",
        "iconName": "waves",
        "tags": "sea, ocean, tide",
        "group": "miscellaneous",
        "codepoint": 62231
    },
    {
        "displayName": "Rain",
        "iconName": "rain",
        "tags": "precipitation, storm, weather",
        "group": "miscellaneous",
        "codepoint": 62085
    },
    {
        "displayName": "Lightning",
        "iconName": "lightning",
        "tags": "thunder, bolt, strike, weather",
        "group": "miscellaneous",
        "codepoint": 61996
    },
    {
        "displayName": "Wind",
        "iconName": "wind",
        "tags": "air, breath, draft, weather",
        "group": "miscellaneous",
        "codepoint": 62236
    },
    {
        "displayName": "Hurricane",
        "iconName": "hurricane",
        "tags": "storm, cyclone, typhoon, tropical storm",
        "group": "miscellaneous",
        "codepoint": 61942
    },
    {
        "displayName": "Nest",
        "iconName": "nest",
        "tags": "nest, indent, down right",
        "group": "interface",
        "codepoint": 62032
    },
    {
        "displayName": "Target",
        "iconName": "target",
        "tags": "location, pinpoint, scope, center",
        "group": "interface",
        "codepoint": 62178
    },
    {
        "displayName": "Small square",
        "iconName": "small-square",
        "tags": "square",
        "group": "miscellaneous",
        "codepoint": 62141
    },
    {
        "displayName": "Ship",
        "iconName": "ship",
        "tags": "transportation, ship, boat, cruise, yacht, supply, supply chain, trip, shipping",
        "group": "interface",
        "codepoint": 62132
    },
    {
        "displayName": "Cargo Ship",
        "iconName": "cargo-ship",
        "tags": "transportation, cargo, freight, ship, boat, cruise, yacht, supply, supply chain, container, shipping",
        "group": "interface",
        "codepoint": 61764
    },
    {
        "displayName": "Clip",
        "iconName": "clip",
        "tags": "screenshot, segment, edit",
        "group": "interface",
        "codepoint": 61782
    },
    {
        "displayName": "Add clip",
        "iconName": "add-clip",
        "tags": "screenshot, segment, add",
        "group": "interface",
        "codepoint": 61697
    },
    {
        "displayName": "Rectangle",
        "iconName": "rectangle",
        "tags": "block, area, shape",
        "group": "miscellaneous",
        "codepoint": 62241
    },
    {
        "displayName": "Symbol: rectangle",
        "iconName": "symbol-rectangle",
        "tags": "symbol, rectangle, filled shape",
        "group": "interface",
        "codepoint": 62242
    },
    {
        "displayName": "Fuel",
        "iconName": "fuel",
        "tags": "fuel, gas, gas can, refuel",
        "group": "interface",
        "codepoint": 62243
    },
    {
        "displayName": "Playbook",
        "iconName": "playbook",
        "tags": "strategy, play, plan, course of action",
        "group": "interface",
        "codepoint": 62244
    },
    {
        "displayName": "Rectangle height",
        "iconName": "rect-height",
        "tags": "card, height, vertical, expand",
        "group": "interface",
        "codepoint": 62245
    },
    {
        "displayName": "Rectangle width",
        "iconName": "rect-width",
        "tags": "card, width, horizontal, expand",
        "group": "interface",
        "codepoint": 62246
    },
    {
        "displayName": "Divide",
        "iconName": "divide",
        "tags": "math, symbol, divide, mathematical, equations, expression, formula",
        "group": "action",
        "codepoint": 62247
    },
    {
        "displayName": "Color fill",
        "iconName": "color-fill",
        "tags": "bucket, color, fill",
        "group": "interface",
        "codepoint": 62248
    },
    {
        "displayName": "Horizontal space inbetween",
        "iconName": "horizontal-inbetween",
        "tags": "space, horizontal, gap, inbetween",
        "group": "interface",
        "codepoint": 62249
    },
    {
        "displayName": "Vertical space inbetween",
        "iconName": "vertical-inbetween",
        "tags": "space, vertical, gap, inbetween",
        "group": "interface",
        "codepoint": 62250
    },
    {
        "displayName": "Open application",
        "iconName": "open-application",
        "tags": "open, application, new-tab, external",
        "group": "interface",
        "codepoint": 62251
    },
    {
        "displayName": "Floating point number",
        "iconName": "floating-point",
        "tags": "number, float, double, decimal",
        "group": "miscellaneous",
        "codepoint": 62252
    },
    {
        "displayName": "Floating point array",
        "iconName": "array-floating-point",
        "tags": "number, float, double, decimal, array",
        "group": "miscellaneous",
        "codepoint": 62253
    }
];

var tile_icon_dict = {};

for (let ientry of raw_icon_info) {
    let igroup = ientry.group;
    if (!(igroup in tile_icon_dict)) {
        tile_icon_dict[igroup] = []
    }
    tile_icon_dict[igroup].push(ientry)
}

var tile_icon_categories = Object.keys(tile_icon_dict);