import { DynamoDbSchema, DynamoDbTable } from '@aws/dynamodb-data-mapper';


export class RapperModel {
  public nickname?: string;
  public peerId?: string;
}

export class RoomModel {
  public roomId?: string;
  public roomName?: string;
  public rappers: RapperModel[] = [];
  public registeredDateRoomId?: string;
  public registeredDateYearMonth?: string;
  public expiresAt?: number;
}


Object.defineProperties(RoomModel.prototype, {
  [DynamoDbTable]: { value: 'Rooms' },
  [DynamoDbSchema]: {
    value: {
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
      registeredDateRoomId: {
        type: 'String',
        keyType: 'RANGE'
      },
      registeredDateYearMonth: {
        type: 'String',
        keyType: 'HASH'
      },
      expiresAt: {
        type: 'Number'
      }
    }
  }
});
