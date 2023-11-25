import 'react-quill/dist/quill.snow.css'
import { Navigate } from "react-router-dom";
import ImageResize from 'quill-image-resize-module-react';
import Quill from 'quill';
import ReactQuill from "react-quill"
import { ImageDrop } from 'quill-image-drop-module';
 
Quill.register('modules/imageDrop', ImageDrop);

Quill.register('modules/imageResize', ImageResize);
export function Editor({value, onChange}){
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ["link", "image", "video"],
            ['code-block'],
            ['clean']
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        imageDrop: true
    
    };

    const formats=    [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image','video',
        'code-block'
      ];
    return(

        <ReactQuill value={value} onChange={onChange} modules={modules} formats={formats} />
    );
}