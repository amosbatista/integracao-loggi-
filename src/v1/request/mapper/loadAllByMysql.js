import mySQLService from '../../database/mySQLQueryService'

const service = class {

  async loadAll() {
    return await mySQLService(`
      SELECT 
        R.id,
        R.clientName,
        R.clientEmail, 
        R.clientPhone, 
        R.completeAddress, 
        R.addressComplement, 
        R.totalPurchase, 
        R.deliveryTax, 
        R.servicesSum, 
        R.transactionOperationTax, 
        R.addressLat, 
        R.addressLng, 
        R.status, 
        R.createdAt, 
        R.updatedAt,
        S.serviceId,
        S.amount,
        S.value,
        S.totalValue,
        S.text,
        RO.proposedValue,
        RO.realValue,
        RO.realServiceValue,
        RO.isRealValueDifferentFromProposed,
        RO.reasonToDifference,
        RO.isOrderComplete,
        D_REC.deliveryId as deliveryReceive_deliveryId,
        D_REC.packageId as deliveryReceive_packageId,
        D_REC.type as deliveryReceive_type,
        D_RET.deliveryId as deliveryReturn_deliveryId,
        D_RET.packageId as deliveryReturn_packageId,
        D_RET.type as deliveryReturn_type
      FROM
        requests R
      INNER JOIN services S on
        S.requestId = R.id
      LEFT JOIN requestOrders RO on
        RO.requestId = R.id
      LEFT JOIN deliveries D_REC on
        D_REC.requestId = R.id AND
        D_REC.type = 'to_receive'
      LEFT JOIN deliveries D_RET on
        D_RET.requestId = R.id AND
        D_RET.type = 'to_return'
      ORDER BY 
        R.id desc
      LIMIT 100
    `)
  }
}

export default service