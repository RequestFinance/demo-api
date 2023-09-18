import { User } from "../models/User";
import { faker } from "@faker-js/faker";

/**
 * This file simulates users stored in a database
 */
export const usersDatabase = {
  1: new User("1", faker.person.firstName(), faker.person.lastName()),
  2: new User("2", faker.person.firstName(), faker.person.lastName()),
  3: new User("3", faker.person.firstName(), faker.person.lastName()),
};
