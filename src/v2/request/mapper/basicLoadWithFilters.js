import mySQLService from '../../database/mySQLQueryService'
import status from '../status'

const service = class {
  
  async load(filters, pageNumber, pageLimit, limitedIdFromUserRequest) {
    
    let filterContent = '';
    let queryContent = '';

    const addFilter = (originalContent, newFilter) => {
      if(!newFilter){
        return originalContent;
      }
      return originalContent === "" ?
         `'${newFilter}'` :
        `${originalContent}, '${newFilter}'`
    }
    
    
    filterContent = addFilter(filterContent, filters.atReceive ? status.AT_RECEIVE : null)
    filterContent = addFilter(filterContent, filters.atFinish ? status.AT_FINISH : null);
    filterContent = addFilter(filterContent, filters.waitingPayment ? status.WAITING_PAYMENT : null );
    filterContent = addFilter(filterContent, filters.readyToReturn ? status.READY_TO_RETURN : null);
    filterContent = addFilter(filterContent, filters.returned ? status.RETURNED : null);      
    
    if(filters.query) {
      queryContent = queryContent + `(R.clientName LIKE '%${filters.query}%'
        OR R.clientName LIKE '${filters.query}%'
        OR R.clientEmail LIKE '%${filters.query}%'
        OR R.clientEmail LIKE '${filters.query}%'
        OR R.id = '${filters.query}'
        OR D_REC.deliveryId = '${filters.query}'
        OR D_RET.deliveryId = '${filters.query}'
      )`
    }
  
    const whereContent = `
      WHERE R.ID IS NOT NULL
      ${filterContent != "" ? 
        "AND R.STATUS IN (" + filterContent + ")" :
        ""
      }
      ${filters.query ? 
        "AND " + queryContent :
        ""
      }
      ${limitedIdFromUserRequest ? "AND R.USERID = " + limitedIdFromUserRequest : ""}
    `

    const commandForRecords = `
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
        D_REC.createdAt as deliveryReceive_createdAt,
        D_REC.deliveryStatus as deliveryReceive_deliveryStatus,
        D_RET.deliveryId as deliveryReturn_deliveryId,
        D_RET.packageId as deliveryReturn_packageId,
        D_RET.type as deliveryReturn_type,
        D_RET.createdAt as deliveryReturn_createdAt,
        D_RET.deliveryStatus as deliveryReturn_deliveryStatus
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
      ${ whereContent }
      ORDER BY 
        R.id DESC
      LIMIT ${pageLimit ? pageLimit : 10} OFFSET ${pageNumber ? (pageNumber - 1) * pageLimit : 0}
    `;

    const commandForTotal = `
      SELECT 
        COUNT(*) as total
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
      ${ whereContent }
    `;

    return await {
      records: await mySQLService(commandForRecords),
      recordsCount: await mySQLService(commandForTotal),
    }
  }
}

export default service