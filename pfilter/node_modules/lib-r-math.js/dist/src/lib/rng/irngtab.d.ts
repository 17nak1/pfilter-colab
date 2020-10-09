import { IN01Type } from './in01-type';
import { IRNGType } from './irng-type';
export interface IRNGTab {
    kind: IRNGType;
    Nkind: IN01Type;
    name: string;
    n_seed: number;
    i_seed: Uint32Array;
}
