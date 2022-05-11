import {exec} from "child_process"


exec('docker ps | grep postgis | wc -l', (err: any,output: any) => {
    if(err) return;
    if(Number(output) === 0){
        process.env.MOCKED = "mocked-test"
    }
})


