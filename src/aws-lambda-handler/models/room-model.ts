// import { table, hashKey, rangeKey, attribute } from '@aws/dynamodb-data-mapper-annotations'
import { DynamoDbSchema, DynamoDbTable } from '@aws/dynamodb-data-mapper';

export class RapperModel {
  public nickname?: string;

  public peerId?: string;
}

export class RoomModel {

  public registeredDateYearMonth?: string;
  public registeredDateRoomId?: string;
  public roomId?: string;
  public roomName?: string;
  public rappers?: Array<RapperModel>;
  public expiresAt?: number;

}

Object.defineProperties(RoomModel.prototype, {
  [ DynamoDbTable ]: {
    value: 'Rooms'
  },
  [ DynamoDbSchema ]: {
    value: {
      registeredDateYearMonth: {
        type: 'String',
        keyType: 'HASH'
      },
      registeredDateRoomId: {
        type: 'String',
        keyType: 'RANGE'
      },
      roomId: {
        type: 'String'
      },
      roomName: {
        type: 'String'
      },
      rappers: {
        type: 'Collection',
        members: {
          type: 'Document',
          members: {
            nickname: {
              type: 'String'
            },
            peerId: {
              type: 'String'
            }
          }
        }
      },
      expiresAt: {
        type: 'Number'
      }

    }
  }
});
