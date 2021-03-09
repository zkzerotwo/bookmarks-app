import React, { Component } from 'react';
import config from './config';

export default class EditArticleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValues: {
                title: '',
                id: '',
                url: '',
                rating: null,
                description: '',
                error: false
            }

        }
    }


    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        fetch(`https://localhost:8080/api/bookmarks/${bookmarkId}`, {
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
                  inputValues:   {
                    title: responseData.title,
                    id: responseData.id,
                    url: responseData.url,
                    rating: responseData.rating,
                    description: responseData.description
                }
                })
            })
            .catch(error => { this.setState({ error }) })
    }

    handleSubmit = e => {
        e.preventDefault()
        // get the form fields from the event
        const { title, url, description, rating } = e.target
        const bookmark = {
            title: title.value,
            url: url.value,
            description: description.value,
            rating: rating.value,
        }
        this.setState({ error: null })
        fetch(config.API_ENDPOINT, {
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
            .then(data => {
                this.context.updateBookmark(data)
                title.value = ''
                url.value = ''
                description.value = ''
                rating.value = ''

                this.props.history.push('/')
                // this.props.onAddBookmark(data)
            })
            .catch(error => {
                this.setState({ error })
            })
    }
    /* state for inputs etc... */
    render() {
        const { title, url, rating, description } = this.state
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
                            defaultValue='1'
                            min='1'
                            max='5'
                            required
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button' 
                        // onClick={this.handleClickCancel}
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