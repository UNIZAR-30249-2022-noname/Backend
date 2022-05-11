export type Args = [Record<string, any>, any, string];


export class RabbitContextArgs{
    public static construirArgs(body: string, Data: any, pattern: string): Args {
        
       let rmqcontextArgs: Args = 
       [
            {content: 
              body
            }
            ,Data
            ,pattern
        ]

        return rmqcontextArgs;
    }
}