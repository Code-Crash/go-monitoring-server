


export const EntryServerToClient = (sEntry) => {
    const cEntry = {};

    if (sEntry) {
        if (sEntry.hasOwnProperty('entry')) {
            if (sEntry.entry.hasOwnProperty('id')) {
                // cEntry._id = sEntry.entry.id; // Rename ID field as per material issues (https://github.com/mbrn/material-table/issues/1074)
                cEntry.id = sEntry.entry.id; // Rename ID field as per material issues (https://github.com/mbrn/material-table/issues/1074)
            }
            if (sEntry.entry.hasOwnProperty('cronId')) {
                cEntry.cronId = sEntry.entry.cronId;
            }
            if (sEntry.entry.hasOwnProperty('taskId')) {
                cEntry.taskId = sEntry.entry.taskId;
            }

            if (sEntry.entry.hasOwnProperty('status')) {
                cEntry.status = sEntry.entry.status;
            }
            if (sEntry.entry.hasOwnProperty('time')) {
                cEntry.time = sEntry.entry.time;
            }
            if (sEntry.entry.hasOwnProperty('name')) {
                cEntry.name = sEntry.entry.name;
            }
            if (sEntry.entry.hasOwnProperty('description')) {
                cEntry.description = sEntry.entry.description;
            }
            if (sEntry.entry.hasOwnProperty('headers')) {
                cEntry.headers = sEntry.entry.headers;
            }
            if (sEntry.entry.hasOwnProperty('host')) {
                cEntry.host = sEntry.entry.host;
            }
            if (sEntry.entry.hasOwnProperty('port')) {
                cEntry.port = sEntry.entry.port;
            }
            if (sEntry.entry.hasOwnProperty('path')) {
                cEntry.path = sEntry.entry.path;
            }
            if (sEntry.entry.hasOwnProperty('method')) {
                cEntry.method = sEntry.entry.method;
            }
            if (sEntry.entry.hasOwnProperty('protocol')) {
                cEntry.protocol = sEntry.entry.protocol;
            }
            if (sEntry.entry.hasOwnProperty('body')) {
                cEntry.body = sEntry.entry.body;
            }

            // Extra Details
            if (sEntry.hasOwnProperty('next')) {
                cEntry.next = sEntry.next;
            }
            if (sEntry.hasOwnProperty('prev')) {
                cEntry.prev = sEntry.prev;
            }
            if (sEntry.hasOwnProperty('schedule')) {
                cEntry.schedule = sEntry.schedule;
            }
            return cEntry;
        } else {
            return cEntry;
        }
    } else {
        return cEntry;
    }
}

export const GetAllEntryServerToClient = (list) => {
    list = (list || []).map((item) => EntryServerToClient(item));
    return list.filter((item) => item.id);
}