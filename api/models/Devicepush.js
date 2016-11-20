/**
 * Devicepush.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  tableName:'devicepush',
  attributes: {
    deviceToken:{
      type:'string',
      required:true,
      columnName:'DEVICETOKEN'
    },
    idUtilisateur:{
      type:'string',
      columnName:'IDUTILISATEUR'
    }

  }
};

