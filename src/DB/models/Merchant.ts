import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from './User';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({length: 50, nullable: true})
  GetirAppSecretKey: string;
  @Column({length: 50, nullable: true})
  GetirRestaurantSecretKey: string;
  @Column({nullable: true, length: 2000})
  GetirAccessToken: string;
  @Column({nullable: true})
  GetirTokenLastCreated: Date;
  @Column({length: 50, nullable: true})
  YemekSepetiAppSecretKey: string;
  @Column({length: 50, nullable: true})
  YemekSepetiRestaurantSecretKey: string;
  @Column({name: 'userId'})
  UserId: number;
  @OneToOne(() => User, user => user.Merchant)
  @JoinColumn()
  User: User;

  // GetirApi: 'https://food-external-api-gateway.getirapi.com/'
  // GetirApi: 'https://food-external-api-gateway.development.getirapi.com/'
}
