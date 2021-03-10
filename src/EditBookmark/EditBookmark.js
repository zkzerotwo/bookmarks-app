import React, { Component } from 'react';
import config from '../config';
import PropTypes from 'prop-types'

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)

export default class EditArticleForm extends Component {

    static propTypes = {
        match: PropTypes.shape({
          params: PropTypes.object,
        }),
        history: PropTypes.shape({
          push: PropTypes.func,
        }).isRequired,
      };

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            title: '',
            id: '',
            url: '',
            rating: null,
            description: ''


        }
    }


    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'GET'
        })
            .then(res => {
                if (!res.ok) {
                    // get the error message from the response,
                    return res.json().then(error => {
                        // then throw it
                        throw error
                    })
                }
                return res.json()
            })
            .then(responseData => {
                console.log(responseData)
                this.setState({
                        title: responseData.title,
                        id: responseData.id,
                        url: responseData.url,
                        rating: responseData.rating,
                        description: responseData.description
                })
            })
            .catch(error => { this.setState({ error }) })
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
      };
    
      handleChangeUrl = e => {
        this.setState({ url: e.target.value })
      };
    
      handleChangeDescription = e => {
        this.setState({ description: e.target.value })
      };
    
      handleChangeRating = e => {
        this.setState({ rating: e.target.value })
      };

    handleSubmit = e => {
        e.preventDefault()
        // get the form fields from the event
        const { bookmarkId } = this.props.match.params
        const { title, url, description, rating } = this.state
        const bookmark = { title, url, description, rating }
        this.setState({ error: null })
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    // get the error message from the response,
                    return res.json().then(error => {
                        // then throw it
                        throw error
                    })
                }
                return res.json()
            })
            .then(() => {
                this.resetFields(bookmark)
                this.context.updateBookmark(bookmark)
              })
            .catch(error => {
                this.setState({ error })
            })
    }

    resetFields = (newFields) => {
        this.setState({
          id: newFields.id || '',
          title: newFields.title || '',
          url: newFields.url || '',
          description: newFields.description || '',
          rating: newFields.rating || '',
        })
      }
    
      handleClickCancel = () => {
        this.props.history.push('/')
      };
    /* state for inputs etc... */
    render() {
        const { title, url, rating, description, error } = this.state
        return (
            <section className='EditArticleForm'>
                <h2>Edit bookmark</h2>
                <form
                    className='EditBookmark__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='EditBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
              {' '}
                            <Required />
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value={title}
                            onChange={this.handleChangeTitle}
                            placeholder='Great website!'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
              {' '}
                            <Required />
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            value={url}
                            onChange={this.handleChangeUrl}
                            placeholder='https://www.great-website.com/'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
            </label>
                        <textarea
                            name='description'
                            id='description'
                            value={description}
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
              {' '}
                            <Required />
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            value={rating}
                            onChange={this.handleChangeRating}
                            min='1'
                            max='5'
                            required
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button'
                        onClick={this.handleClickCancel}
                        >
                            Cancel
            </button>
                        {' '}
                        <button type='submit'>
                            Save
            </button>
                    </div>
                </form>
            </section>
        )
    }
}