import {Form, Text} from "informed";
import {required} from "../../Utility/Constraints";
import PropTypes from "prop-types";
import {compose, graphql} from "react-apollo";
import React, {Component} from "react";
import addTagTile from "../../Mutation/addTagTile";
import getTags from "../../Query/getTags";
import deleteTagTile from "../../Mutation/deleteTagTile";
import updateTile from "../../Mutation/updateTile";
import {S3Image} from "aws-amplify-react";
import {compareString} from "../../Utility";

class EditTile extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState = ({tile: {tt}}) => ({
        submitting: false,
        failed: undefined,
        tags: tt.map(tt => tt.tag.id)
    });

    submit({name}) {
        this.setState({submitting: true});

        const {updateTile, tile} = this.props;

        const {id} = tile;
        if (tile.name !== name) {
            updateTile({id, name}).then(this.onSuccess.bind(this));
        } else {
            this.onSuccess();
        }
    }

    toggleTT(id) {
        const {tags} = this.state;
        const {deleteTagTile, addTagTile, tile} = this.props;
        if (tags.includes(id)) {
            const tt = tile.tt.find(tt => tt.tag.id === id);
            deleteTagTile(tt.id);
            this.setState({tags: tags.filter(t => t !== id)});
        } else {
            addTagTile({tileID: tile.id, tagID: id});
            tags.push(id);
            this.setState({tags});
        }
    }

    onSuccess() {
        this.props.close();
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    render() {
        const {submitting, failed, tags: selectedTags} = this.state;
        const {tags, tile} = this.props;
        return (
            <div className="popup">
                <Form className="popup-inner" onSubmit={this.submit.bind(this)}>
                    {({formState: {errors, invalid, pristine}}) =>
                        <div>
                            {failed && <p className="form-error">{failed}</p>}
                            <div className="tile-image">
                                <div className="img-container tile-icon">
                                    <S3Image imgKey={tile.icon.key}/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <Text id="name" type="text" initialValue={tile.name} placeholder="Name" validateOnChange validateOnMount validate={required} field="name"/>
                                {errors['name'] && <span className="form-error">{errors['name']}</span>}
                            </div>
                            <div>
                                <label>Tags</label>
                                {tags.sort((a, b) => compareString(a.name, b.name)).map(tag =>
                                    <div className="custom-control custom-checkbox" key={tag.id}>
                                        <input type="checkbox" className="custom-control-input" id={'tag-' + tag.id} onChange={this.toggleTT.bind(this, tag.id)} checked={selectedTags.includes(tag.id)}/>
                                        <label className="custom-control-label" htmlFor={'tag-' + tag.id}>{tag.name}</label>
                                    </div>)}
                            </div>
                            <div>
                                <button disabled={submitting} type="button" className="btn-main btn-right" onClick={this.props.close}>Cancel</button>
                                <button disabled={submitting || pristine || invalid} type="submit" className="btn-main btn-left">Update tile</button>
                            </div>
                        </div>
                    }
                </Form>
            </div>
        );
    }
}

EditTile.propTypes = {
    close: PropTypes.func.isRequired,
    tile: PropTypes.shape({
        name: PropTypes.string.isRequired,
        tt: PropTypes.array.isRequired,
        icon: PropTypes.object.isRequired,
        owner: PropTypes.string.isRequired
    }).isRequired
};

export default compose(
    graphql(updateTile, {
        props: ({mutate}) => ({
            updateTile: (tile) => mutate({variables: {...tile}})
        })
    }),
    graphql(addTagTile, {
        props: ({mutate}) => ({
            addTagTile: (tagTile) => mutate({variables: {...tagTile}})
        })
    }),
    graphql(deleteTagTile, {
        props: ({mutate}) => ({
            deleteTagTile: id => mutate({variables: {id}})
        })
    }),
    graphql(getTags, {
        options: ({tile: {owner}}) => ({
            variables: {owner},
            fetchPolicy: 'cache-and-network'
        }),
        props: ({data: {getTags}}) => ({
            tags: getTags || []
        })
    })
)(EditTile);