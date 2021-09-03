import Quill from "quill";
import { useRef , useEffect } from "react";

const QuillEditor = (props)=>{
    const quill_ref = useRef(null);
    useEffect(() => {
        const quill = new Quill(quill_ref.current , {
            theme : 'snow',
            placeholder : props.placeholder || 'Enter Your Text Here'
        });
        quill.on('text-change',()=>{
            props.onChange(quill_ref.current.children[0].innerHTML);
        })
    }, [])
    useEffect(()=>{
        quill_ref.current.children[0].innerHTML = props.initialValue;
        console.log(props.initialValue);
    },[props.initialValue])

    return (
        <>
        <div className="quill-editor" ref={quill_ref}></div>
        </>
    )
}

export default QuillEditor;