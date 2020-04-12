import React from 'react';
import {DropzoneArea} from 'material-ui-dropzone';

interface Props {
  onChange: (files: string[]) => void;
  onDrop: (fieldName: string, value: any) => void;
  currentImages: any;
}

export const Dropzone = (props: Props) => {
  return (
    <DropzoneArea
      acceptedFiles={['image/*']}
      showFileNames={false}
      useChipsForPreview
      onDrop={(acceptedFiles) => {
        console.log('ACCEPTED FILES: ', acceptedFiles);
        const newImages = [...props.currentImages, acceptedFiles];
        props.onDrop('images', newImages);
      }}
      onChange={props.onChange}
      dropzoneText="Tap here to upload pictures of your product"
      filesLimit={5}
    />
  );
};
