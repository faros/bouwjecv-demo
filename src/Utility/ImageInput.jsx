import {asField} from "informed";
import PropTypes from "prop-types";
import React, {Component} from "react";


class ImageFileInputWithPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePlaceholder: props.image ? URL.createObjectURL(props.image) : props.placeholder
        };
    }

    selectFile() {
        this.input.click();
    }

    onChange(event) {
        const [file,] = event.target.files || [];
        if (file) {
            if (this.props.onChange) {
                this.props.onChange(file);
            }
            URL.revokeObjectURL(this.state.imagePlaceholder);
            this.setState({imagePlaceholder: URL.createObjectURL(file)});
        }
    }

    componentWillUnmount() {
        URL.revokeObjectURL(this.state.imagePlaceholder);
    }

    render() {
        const {imagePlaceholder} = this.state;
        return (
            <div>
                <input accept="image/*" capture ref={ref => this.input = ref} type="file" onChange={this.onChange.bind(this)} className="hide"/>
                {imagePlaceholder ?
                    <img className="img-container" src={imagePlaceholder} alt="Profile" onClick={this.selectFile.bind(this)}/> : ""}
            </div>
        );
    }
}

ImageFileInputWithPreview.propTypes = {
    image: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.any
};

export default asField(({fieldState, fieldApi, imagePlaceholder, ...props}) => {
    const {value} = fieldState;
    const {setValue, setTouched} = fieldApi;
    return (
        <ImageFileInputWithPreview placeholder={imagePlaceholder} image={value} onChange={file => {
            setValue(file);
            setTouched();
        }}/>
    );
});