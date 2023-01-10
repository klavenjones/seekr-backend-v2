import { ISession } from 'connect-typeorm';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionEntity implements ISession {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  public id: string;

  @Index()
  @Column({ type: 'bigint' })
  public expiredAt: number;

  @Column({ type: 'text' })
  public json: string;

  @DeleteDateColumn({ type: 'text' })
  public destroyedAt?: Date;
}
