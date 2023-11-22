export interface QueryClass {
    kind:        string;
    definitions: Definition[];
    loc:         Loc;
}

export interface Definition {
    kind:                 string;
    operation?:           string;
    variableDefinitions?: VariableDefinition[];
    directives:           object;
    selectionSet:         SelectionSet;
    name?:                Name;
    typeCondition?:       TypeCondition;
}

export interface Name {
    kind:  Kind;
    value: string;
}

export enum Kind {
    Name = "Name",
}

export interface Selection {
    kind:          string;
    name:          Name;
    arguments?:    Argument[];
    directives:    object;
    selectionSet?: SelectionSet;
}

export interface SelectionSet {
    kind:       string;
    selections: Selection[];
}

export interface Argument {
    kind:  string;
    name:  Name;
    value: TypeCondition;
}

export interface TypeCondition {
    kind: string;
    name: Name;
}

export interface VariableDefinition {
    kind:       string;
    variable:   TypeCondition;
    type:       TypeCondition;
    directives: object;
}

export interface Loc {
    start: number;
    end:   number;
}
