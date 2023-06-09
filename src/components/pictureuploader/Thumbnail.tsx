import React from "react";
import { IPictureUpload, PictureUploadStatus } from "../../models";
import { Stack, StackItem, Image, ImageFit, Text, useTheme, IconButton, mergeStyles, FontIcon, Spinner, SpinnerSize } from "@fluentui/react";
import { ErrorIndicator } from "../ui-elements";

export interface IThumbnailProps {
    width?: number;
    height?: number;
    picture: IPictureUpload;
    onRemove:(id:string)=>void;
}
const iconClass = mergeStyles({
    height: 10,
    width: 10,
});
export const Thumbnail: React.FunctionComponent<IThumbnailProps> = (props: IThumbnailProps) => {
    const theme = useTheme();
    const width = React.useMemo(() => props.width ? props.width : 100, [props.width]);
    const height = React.useMemo(() => props.height ? props.width : 100, [props.height]);
    const [dataSrc, setDataSrc] = React.useState<string>();
    React.useEffect(() => {
        const fr = new FileReader();
        fr.onloadend = () => setDataSrc(fr.result as string);
        fr.readAsDataURL(props.picture.file);
    }, [props.picture.file])
    return <Stack>
        <StackItem style={{ height: height + "px" }}>{dataSrc ? <Image
            width={width}
            height={height}
            src={dataSrc}
            imageFit={ImageFit.centerContain}
            styles={{ root: { border: '1px solid ' + theme.palette.neutralSecondary, borderRadius: "5px" } }}
        /> : null}</StackItem>
        <StackItem style={{ width: width + "px" }}>
            <Stack horizontalAlign="space-between" horizontal verticalAlign="center">
                <StackItem style={{maxWidth:(width-10)+"px"}}>
                    <Text variant="xSmall" nowrap block>{props.picture.file.name}</Text>
                </StackItem>
                <StackItem align="end">
                    {props.picture.status == PictureUploadStatus.SELECTED?
                        <IconButton 
                            iconProps={{ iconName: "Trash" }} 
                            styles={{ icon: { fontSize: 10 } }}
                            className={iconClass} 
                            onClick={()=>props.onRemove(props.picture.id)}/> :null}
                    {props.picture.status == PictureUploadStatus.UPLOADED?
                        <FontIcon 
                            iconName="CheckMark" 
                            style={ {fontSize: 10 } }
                            className={iconClass} 
                            /> :null}
                    {props.picture.status == PictureUploadStatus.UPLOADING?
                        <Spinner size={SpinnerSize.xSmall}/> :null}
                    {props.picture.status == PictureUploadStatus.ERROR?
                        <ErrorIndicator
                            errorText={props.picture.errorInformation+""}
                            errorTitle="Error during upload!"
                            size={10}
                        /> :null}
                </StackItem>
            </Stack>
        </StackItem>
    </Stack>
}