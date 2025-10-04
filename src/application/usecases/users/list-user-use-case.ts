import { User, UserRole } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/users/user-repository";
import { AppError } from "@/shared/errors/app-error";


export class ListUsersUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(currentUser: { id: String; role: UserRole }): Promise<User[]> {
        if (currentUser.role === UserRole.ADMIN) {
            return this.userRepository.findAll();
        }

        if (currentUser.role === UserRole.SECRETARY) {
            return this.userRepository.findAll({ roles: [UserRole.STUDENT, UserRole.TEACHER] })
        }
        throw new AppError('Forbideen', 403)
    }
}