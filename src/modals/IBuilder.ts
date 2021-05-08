import { IPair } from "./IPair";

export interface IBuilder{
    image:IPair
    container:IPair
    ports:IPair[]
    volumes:IPair[]
    enviornments:IPair[]
    network:IPair
}