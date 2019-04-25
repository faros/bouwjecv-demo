import {Form, Select, Text} from "informed";
import {required} from "../../Utility/Constraints";
import PropTypes from "prop-types";
import {compose, graphql} from "react-apollo";
import React, {Component} from "react";
import addTagTile from "../../Mutation/addTagTile";
import addTile from "../../Mutation/addTile";
import ImageInput from "../../Utility/ImageInput";
import imgPlaceholder from "../../Image/imgPlaceholder.png";
import getTags from "../../Query/getTags";
import {toS3Object} from "../../Utility";
import getTiles from "../../Query/getTiles";

class NewTile extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    async submit({name, image, tags}) {
        this.setState({submitting: true});

        const {owner, addTile, addTagTile} = this.props;

        const S3Image = toS3Object(image);
        S3Image.key = 'tile/' + owner + '/' + S3Image.key;

        try {
            const {data: {addTile: {id: tileID}}} = await addTile({
                name,
                icon: S3Image,
                owner
            });

            if (tags) {
                const tagTiles = [];
                for (const tagID of tags) {
                    tagTiles.push(addTagTile({tileID, tagID}));
                }

                Promise.all(tagTiles).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
            } else {
                this.onSuccess();
            }
        } catch (reason) {
            this.onError(reason);
        }
    }

    onSuccess() {
        this.props.close();
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    render() {
        const {submitting, failed} = this.state;
        const {tags} = this.props;
        return (
            <div className="popup">
                <Form className="popup-inner" onSubmit={this.submit.bind(this)}>
                    {({formState: {errors, invalid}}) =>
                        <div>
                            {failed && <p className="form-error">{failed}</p>}
                            <div className="tile-image">
                                <label>Image</label>
                                <ImageInput field="image" validateOnMount validateOnChange validate={required} imagePlaceholder={imgPlaceholder}/>
                                {errors['image'] && <span className="form-error">{errors['image']}</span>}
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <Text id="name" type="text" placeholder="Name" validateOnChange validateOnMount validate={required} field="name"/>
                                {errors['name'] && <span className="form-error">{errors['name']}</span>}
                            </div>
                            <div>
                                <label htmlFor="tags">Tags</label>
                                <Select id="tags" field="tags" className="custom-select" multiple>
                                    {tags.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1).map(tag =>
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <button disabled={submitting} type="button" className="btn-main btn-right" onClick={this.props.close}>Cancel</button>
                                <button disabled={submitting || invalid} type="submit" className="btn-main btn-left">Add new tile</button>
                            </div>
                        </div>
                    }
                </Form>
            </div>
        );
    }
}

NewTile.propTypes = {
    owner: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
};

export default compose(
    graphql(addTile, {
        props: ({mutate}) => ({
            addTile: (tile) => mutate({variables: {...tile}})
        })
    }),
    graphql(addTagTile, {
        options: ({owner}) => ({
            refetchQueries: [{query: getTiles, variables: {owner}}]
        }),
        props: ({mutate}) => ({
            addTagTile: (tagTile) => mutate({variables: {...tagTile}})
        })
    }),
    graphql(getTags, {
        options: ({owner}) => ({
            variables: {owner},
            fetchPolicy: 'cache-and-network'
        }),
        props: ({data: {getTags}}) => ({
            tags: getTags || []
        })
    })
)(NewTile);