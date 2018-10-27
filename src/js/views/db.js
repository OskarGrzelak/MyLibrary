const openIndexedDB = () => {
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }
    
    const openDB = indexedDB.open("Database", 1);
    openDB.onupgradeneeded = function(e) {
        console.log('upgrading');
        const db = {};
        db.result = openDB.result;
        db.store = db.result.createObjectStore('Collection', { keyPath: 'type' });
    };
    console.log('database has been opened');

    return openDB;
};

const getStoreIndexedDB = openDB => {
    console.log('creating store');
    const db = {};
    db.result = openDB.result;
    db.tx = db.result.transaction('Collection', 'readwrite');
    db.store = db.tx.objectStore('Collection');

    return db;
};

export const saveIndexedDB = (type, data) => {
    const openDB = openIndexedDB();
    openDB.onerror = () => console.log('error ' + e.target.errorCode);
    openDB.onsuccess = () => {
        const db = getStoreIndexedDB(openDB);
        db.store.put({ type: type, data: data });
        db.tx.oncomplete = () => db.result.close();
        console.log('data has been updated');
    };

    return true;
};

export const loadIndexedDB = (callback) => {
    const openDB = openIndexedDB();
    openDB.onerror = () => console.log('error ' + e.target.errorCode);
    openDB.onsuccess =() => {
        const db = getStoreIndexedDB(openDB);
        const retrievedData = db.store.getAll();
        retrievedData.onsuccess = () => {
            callback(retrievedData.result);
        };

        db.tx.oncomplete = () => db.result.close();
    };

    return true;
};

export const destroyIndexedDB = (name) => {
    const DBDeleteRequest = window.indexedDB.deleteDatabase(name);
    DBDeleteRequest.onerror = () => console.log("Error deleting database."); 
    DBDeleteRequest.onsuccess = () => console.log("Database deleted successfully");
};