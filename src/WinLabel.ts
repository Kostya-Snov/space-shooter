import { ResultLabel } from "./ResultLabel";


export class WinLabel extends ResultLabel {
    public constructor() {
        super("YOU WIN", 0x00FF00);
    }
}
