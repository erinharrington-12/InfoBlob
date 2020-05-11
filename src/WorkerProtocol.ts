export namespace Protocol {
  export namespace Worker {
    export interface StartRequest {
      type: 'start';
      code: string;
    }

    export interface StopRequest {
      type: 'stop';
      hello: string;
    }

    export type Request = StartRequest | StopRequest | SetRegisterRequest | ProgramEndedRequest | ProgramOutputRequest | ProgramErrorRequest;

    export interface StartResponse {
      type: 'start';
    }

    export interface StopResponse {
      type: 'stop';
    }

    export interface ProgramEndedRequest {
      type: 'program-ended'
    }

    export interface ProgramEndedResponse {
      type: 'program-ended'
    }

    export type Response = StartResponse | StopResponse | SetRegisterResponse | ProgramEndedResponse;


    export interface SetRegisterRequest {
      type: 'setregister';
      address: number;
      value: number;
    }

    export interface SetRegisterResponse {
      type: 'setregister';
    }

    export interface ProgramOutputRequest {
      type: 'programoutput';
      stdoutput: string;
    }
    
    export interface ProgramErrorRequest {
      type: 'programerror';
      stdoutput: string;
      stderror: string;
    }
  }

  export namespace Host {
    
  }
}

export default Protocol;