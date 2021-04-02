import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories';
import { AppError } from '@shared/errors';
import { IBaseUseCase } from '@shared/useCases';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
}

@injectable()
class CreateCarUseCase implements IBaseUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(data: IRequest): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      data.license_plate,
    );

    if (carAlreadyExists) {
      throw new AppError('Car already exists.');
    }

    const car = await this.carsRepository.create({
      name: data.name,
      description: data.description,
      daily_rate: data.daily_rate,
      license_plate: data.license_plate,
      fine_amount: data.fine_amount,
      brand: data.brand,
      category_id: data.category_id,
    });

    return car;
  }
}

export { CreateCarUseCase };