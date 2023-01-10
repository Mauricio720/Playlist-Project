import { Handler } from "infra/http/Http";
import { Storage, StorageFields, StorageProps} from "infra/storage/Storage";
import multer from "multer";
import { join } from "path";
import { unlinkSync, mkdirSync, existsSync } from "fs";

export class LocalStorageAdapter implements Storage{
    private path=join(__dirname,"..", "..", "..","/public",)

    middleware(props: StorageProps, mimeType?: string): Handler {
        const completePath=join(this.path,props.path);
        if(!existsSync(completePath)){
            mkdirSync(completePath, { recursive: true });
        }
        
        const storage = multer.diskStorage({
            destination:(_,__,callback)=>{
                callback(null,completePath);
            },
            filename:(req, file, callback)=>{
                const newFile = file as any;
                const name = `${Date.now()}-${file.originalname.replace(/\s/gim, "")}`;
                newFile.location = `${props.path}/${name}`;
                newFile.key = `${props.path}/${name}`;
                newFile.originalname = file.originalname;
                
                req.file = newFile;
                callback(null, name);
            },
        });
        
        return multer({
            storage,
            fileFilter:(req, file, callback)=>{
                if(!mimeType){
                    callback(null, true);
                    return;
                }
                callback(null, file.mimetype.split("/")[0] === mimeType.split("/")[0]);
            },
            
        }).single(props.key) as Handler;
    }

    middlewareMultiple(fields: StorageFields[]): Handler {
        const storage = multer.diskStorage({
            destination:(_,file,callback)=>{
                const field=fields.find((fieldItem)=>fieldItem.name===file.fieldname)
                const completePath=join(this.path,field.path);
                
                callback(null,completePath);
            },
            filename:(req, file, callback)=>{
                const field=fields.find((fieldItem)=>fieldItem.name===file.fieldname)
                const completePath=join(this.path,field.path);
                if(!existsSync(completePath)){
                    mkdirSync(completePath, { recursive: true });
                }
                
                const newFile = file as any;
                const name = `${Date.now()}-${file.originalname.replace(/\s/gim, "")}`;
                newFile.location = `${field.path}/${name}`;
                newFile.key = `${field.path}/${name}`;
                newFile.originalname = file.originalname;
                
                req.file = newFile;
                callback(null, name);
            },
        });
        

        return multer({
            storage,
            fileFilter:(req, file, callback)=>{
                if(!file.mimetype){
                    callback(null, true);
                    return;
                }
                callback(null, file.mimetype.split("/")[0] === file.mimetype.split("/")[0]);
            },
            
        }).fields(fields) as Handler;
    }

    async deleteFile(name: string): Promise<void> {
        unlinkSync(join(this.path, name));
    }
}