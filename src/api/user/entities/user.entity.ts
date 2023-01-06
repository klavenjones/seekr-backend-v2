import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsAlpha, IsEmail } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', unique: true, length: 255 })
  @IsEmail()
  public email: string;

  @Column({ type: 'varchar', length: 64 })
  public password: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsAlpha()
  public firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsAlpha()
  public lastName: string;
}
