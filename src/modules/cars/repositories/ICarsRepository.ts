import { ICreateCarDTO, IFindAllAvailableDTO } from '../dtos';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  findAllAvailable(data?: IFindAllAvailableDTO): Promise<Car[]>;
  findById(id: string): Promise<Car | undefined>;
  save(car: Car): Promise<void>;
}

export { ICarsRepository };