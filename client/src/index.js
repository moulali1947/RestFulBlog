import React from 'react'
import ReactDOM from 'react-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import './styles.css'
import axios from 'axios'
import arrayBufferToBase64 from './buffertoimage'
var serveradd = 'http://localhost:4000'
class Blog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      returnobj: [],
      comment: '',
      store: [],
      value: '',
      form: '',
      formvalue: false,
      lastid: '',
      loginStatus: false,
      name: '',
      // Image state objects
      file: null
      // myImage1: '' // show image selected
    }
    // Blog functions
    this.ShowthisBlog = this.ShowthisBlog.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.Showthisfirst = this.Showthisfirst.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.PostBlog = this.PostBlog.bind(this)
    this.PostBlogAPI = this.PostBlogAPI.bind(this)
    // Facebook Authentication functions
    this.logout = this.logout.bind(this)
    // Image upload
    this.onImageChange = this.onImageChange.bind(this)
  }
  componentDidMount () {
    this.fetchData()
    /* This request will get user details from the server. If user is authentiated sucessfully
  it will return a response with user details else it will throw error.
  */
    axios
      .get('/user')
      .then(res => {
        console.log(res)
        this.setState({ loginStatus: true, name: res.data.user.displayName })
      })
      .catch(err => {
        throw err
      })
  }
  logout () {
    // This will logout user from the current session and delete the session.
    this.Showthisfirst()
    axios
      .get('/logout')
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({ loginStatus: false, resdata: '', errormessage: '' })
        }
      })
      .catch(err => {
        this.setState({ resdata: '', errormessage: '' })
        throw err
      })
  }

  // fetch data from the server using the /posts API
  fetchData () {
    axios.get(serveradd + '/posts').then(res => {
      const blogdata = res.data
      console.log(res.data)
      this.setState({ store: blogdata, lastid: blogdata.length })
      // Showthisfirst function is called to display as soon as we retrieve the data from the server.
      this.Showthisfirst()
    }).catch(err => { throw err })
  }

  // Showthisfirst is the menu of the posts retrieved. displays all the posts in short.
  Showthisfirst () {
    this.setState({ formvalue: false })
    var posts = this.state.store.map(item => {
      return (
        <div key={item.id} >
          <Card style={{ width: '70rem' }}>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                {item.date.slice(0, 10)}
              </Card.Subtitle>
              <Card.Subtitle className='mb-2 text-muted'>
                {item.email}
              </Card.Subtitle>
              <Button variant='outline-dark' as='input' onClick={e => this.ShowthisBlog(item.id)} type='submit' value='Read Blog...' />
            </Card.Body>
          </Card>
        </div>
      )
    })
    this.setState({ returnobj: posts })
  }
  // ShowthisBlog will help to display only the selected blog.
  ShowthisBlog (id) {
    var posts = this.state.store.map(item => {
      if (id === item.id) {
        return (
          <div>
            <Card style={{ width: '70rem' }} >
              <Card.Body>
                <div align='center'>
                  <Card.Title>{item.name}</Card.Title>
                  <img src={serveradd + '/images/' + arrayBufferToBase64(item.BlogImage.data.data)} alt='error' />
                  <br /><br />
                  <Card.Subtitle className='mb-2 text-muted'>
                    {item.date.slice(0, 10)}
                  </Card.Subtitle>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {item.email}
                  </Card.Subtitle>
                  <Card.Text>{item.text}</Card.Text>
                </div>
                <Card style={{ width: '40rem' }}>

                  <Card.Subtitle className='mb-2 text-muted'>
                    <br />
                    {item.comments.length > 0
                      ? <div>
                      Comments
                        {item.comments.map((ele) => {
                          return (
                            <div >
                              <b>{ele.user} &nbsp; > &nbsp;
                                {ele.comm}</b>
                            </div>
                          )
                        })}
                      </div>
                      : <div>No comments Yet..!</div>
                    }

                  </Card.Subtitle>
                </Card>
                <form onSubmit={(e) => { this.handleSubmit(e, item.id) }}>

                  <input type='email' name='user' placeholder='Enter Email' /><br />
                  <input type='text' name='comm' placeholder='Enter Comments' /><br />

                  <Button variant='outline-dark' as='input' type='submit' value='Submit' />
                </form>
              </Card.Body>
            </Card>
          </div>
        )
      }
    })
    this.setState({ returnobj: posts })
  }

  // handleChange to save the comments and later can be used to store in db.
  handleChange (event) {
    this.setState({ comment: event.target.value })
  }
  // handleSubmit to post the comments for a particular post.
  handleSubmit (event, id) {
    event.preventDefault()
    const data = new FormData(event.target)
    const body = {
      'user': data.get('user'),
      'comm': data.get('comm')
    }
    if (body.user !== '' && this.state.loginStatus) {
      axios.post(serveradd + '/posts/' + id + '/comments',
        { body }).then(res => {
        if (res.status === 200) { window.alert('comments updated') } else { window.alert('some error occurred') }
        this.fetchData()
      }).catch(err => { throw err })
    } else { window.alert('please enter something or please login to add comments') }
    event.target.reset()
  }
  // to load the image from browser and save it in state object.
  onImageChange (e) {
    this.setState({ file: e.target.files[0] })
    // let url = URL.createObjectURL(e.target.files[0])
    // this.setState({ BlogImage: url })
  }
  // PostBlog jsx element to display the postblog form and to access the form attributes.
  PostBlog () {
    this.setState({ formvalue: true })
    const formdata =
      <div className='PostBlog' align='center'>
        <br /><br />
        <h2>Post a Blog</h2>
        <Card style={{ width: '40rem' }}>
          <Form onSubmit={this.PostBlogAPI}>
            <Form.Group controlId='exampleForm.ControlInput1'>

              <Form.Control type='text' name='name' placeholder='Enter Blog Name' />
            </Form.Group>
            <Form.Group controlId-='exampleForm.ControlInput1'>

              <Form.Control type='email' name='email' placeholder='Enter Your Email' />
            </Form.Group>
            <Form.Group controlId='exampleForm.ControlInput1'>

              <Form.Control type='file' name='file' onChange={this.onImageChange} placeholder='Enter Blog Image' />
            </Form.Group>
            <Form.Group controlId='exampleForm.ControlTextarea1'>

              <Form.Control as='textarea' rows='8' name='text' placeholder='Write your blog' />
            </Form.Group>
            <Button variant='outline-dark' as='input' type='submit' value='Submit' />
          </Form>
        </Card>
      </div>

    this.setState({ form: formdata })
  }

  // PostBlogAPI to post a new blog
  PostBlogAPI (event) {
    event.preventDefault()
    const body = new FormData(event.target)
    body.append('id', this.state.lastid + 1)
    body.append('date', new Date())
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    axios.post(serveradd + '/posts', body, config)
      .then((res) => {
        console.log(res)
        if (res.data.status) { window.alert('Blog Posted') } else { window.alert('Some error occurred') }
      }).catch(err => { throw err })
    event.target.reset()
  }
  render () {
    return (
      <div >
        <a href='http://localhost:3000'><h1 align='center'> RestFulBlog</h1></a>

        <ButtonToolbar id='RenderButton'>
          <Button variant='outline-primary' onClick={this.Showthisfirst} >Back</Button>
          &nbsp;&nbsp;&nbsp;
          {this.state.loginStatus ? <div> <Button variant='outline-dark' onClick={this.PostBlog} >Post a Blog</Button>
          </div> : <div><Button variant='outline-dark' onClick={this.PostBlog} disabled >Post a Blog</Button></div>}

          &nbsp;&nbsp;
          {this.state.loginStatus ? <b><Button variant='outline-success'>{this.state.name}</Button>
          &nbsp;&nbsp;</b> : <Button href={serveradd + '/login'} variant='outline-success'>login</Button>}
        &nbsp;&nbsp;
          <Button variant='outline-danger' onClick={this.logout}>logout</Button><br /><br />
        </ButtonToolbar>

        {this.state.formvalue
          ? <div>
            {this.state.form}
          </div>
          : <div>
            {this.state.returnobj.map(ele => (
              <div>{ele}</div>
            ))}
          </div>
        }

      </div>
    )
  }
}
const rootElement = document.getElementById('root')
ReactDOM.render(<Blog />, rootElement)
