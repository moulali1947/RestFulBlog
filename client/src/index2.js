import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import './styles.css';
class Blog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      returnobj: [],
	    comment: '',
      store: {
        posts: [
          {
            id: 1,
            name: 'Top 10 ES6 Features every Web Developer must know',
            date: '25-Jan-2017',
            url: 'https://webapplog.com/es6',
            text:
              'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
            comments: [
              'Cruel…..var { house, mouse} = No type optimization at all',
              'I think you’re undervaluing the benefit of ‘let’ and ‘const’.',
              '(p1,p2)=>{ … } ,i understand this ,thank you !'
            ]
          },
          {
            id: 2,
            name: 'Top 20 ES6 Features every Web Developer must know',
            date: '25-Jan-2017',
            url: 'https://webapplog.com/es6',
            text:
              'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
            comments: [
              'Cruel…..var { house, mouse} = No type optimization at all',
              'I think you’re undervaluing the benefit of ‘let’ and ‘const’.',
              '(p1,p2)=>{ … } ,i understand this ,thank you !'
            ]
          },
          {
            id: 3,
            name: 'Top 30 ES6 Features every Web Developer must know',
            date: '25-Jan-2017',
            url: 'https://webapplog.com/es6',
            text:
              'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
            comments: [
              'Cruel…..var { house, mouse} = No type optimization at all',
              'I think you’re undervaluing the benefit of ‘let’ and ‘const’.',
              '(p1,p2)=>{ … } ,i understand this ,thank you !'
            ]
          }
        ]
      }
    }
    this.ShowthisBlog = this.ShowthisBlog.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    var posts = this.state.store.posts.map(item => {
      return (
        <div key={item.id}>
          <Card style={{ width: '70rem' }}>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                {item.date}
              </Card.Subtitle>
              <Card.Text>{item.text.slice(0, 50)}........</Card.Text>
              <Card.Link onClick={e => this.ShowthisBlog(item.id)}>
                Read Blog...
              </Card.Link>
            </Card.Body>
          </Card>
        </div>
      )
    })
    this.setState({ returnobj: posts })
  }

  ShowthisBlog (id) {
    var posts = this.state.store.posts.map(item => {
      if (id === item.id) {
        return (
          <>
            <Card style={{ width: '60rem' }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  Techonolgy
                </Card.Subtitle>
                <Card.Text>{item.text}</Card.Text>
                <ol>
                  <li>{item.comments[0]}</li>
                  <li>{item.comments[1]}</li>
                  <li>{item.comments[2]}</li>
                </ol>
                <Card.Link href={item.url}>For more information...</Card.Link>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Your comments:
                    <input type='text' onChange={this.handleChange} />
                  </label>
                  <input type='submit' value='Submit' />
                </form>
              </Card.Body>
            </Card>
          </>
        )
      }
    })
    this.setState({ returnobj: posts })
  }
  handleChange (event) {
    this.setState({ comment: event.target.value })
  }
  handleSubmit (event) {
    alert('A name was submitted: ' + this.state.comment)
    event.preventDefault()
  }
  render () {
    return (
      <>
        <h1 align='center'> RestFulBlog</h1>

        {this.state.returnobj.map(ele => (
          <>{ele}</>
        ))}
      </>
    )
  }
}
const rootElement = document.getElementById('root')
ReactDOM.render(<Blog />, rootElement)
