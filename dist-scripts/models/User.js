"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCollection = exports.USERS_COLLECTION = void 0;
exports.USERS_COLLECTION = 'users';
const getUsersCollection = (db) => {
    return db.collection(exports.USERS_COLLECTION);
};
exports.getUsersCollection = getUsersCollection;
