/* eslint-disable */
import React, { Component } from 'react';
import { BsCircleFill } from 'react-icons/bs';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import '../css/User.css';
import cookie from 'react-cookies';
import io from 'socket.io-client';
import HistoryTable from '../components/HistoryTable';
import Manual from '../components/Manual';

// 채팅서버 연결
const socket = io.connect('https://express-server.run.goorm.io');

// 측정 과정 및 결과를 확인하는 유저 컴포넌트
class User extends Component {
  constructor(props) {
    super(props);
    // 채팅 스크롤 아래로 내리기 위한 Ref
    this.divRef = React.createRef();
    // state 초기화
    this.state = {
      idusers: this.props.idusers,
      isAdmin: cookie.load('isAdmin'),
      messageInput: '',
      messageHistory: [],
      procedures: [],
      history: [],
      current_index: 0,
      current_procedure: '',
      procedure: null,
      length: 100,
      users: null,
      name: '',
      rank: '',
      region: '',
    };
    this.fetchHistoryHandler = this.fetchHistoryHandler.bind(this);
    socket.on('message to user', (message) => {
      console.log(message);
      var tmp = this.state.messageHistory.slice(undefined);
      var d = new Date();
      var nowTime =
        d.getFullYear() +
        '/' +
        (d.getMonth() + 1) +
        '/' +
        d.getDate() +
        '/' +
        d.getHours() +
        '시' +
        d.getMinutes() +
        '분' +
        d.getSeconds() +
        '초';
      var tmp = this.state.messageHistory.concat(
        <div class="d-flex justify-content-start mb-4">
          <div class="msg_cotainer">
            <p>ID: amdin</p>
            <p>{message.message}</p>
            <span class="msg_time">{nowTime}</span>
          </div>
        </div>,
      );
      this.setState({ messageHistory: tmp }, this.scrollToBottom);
    });
    socket.on('procedureStatus to user', (message) => {
      //console.log(message);

      if (message.id === this.state.idusers) {
        if (message.current_index !== this.state.current_index) {
          this.setState({
            current_index: message.current_index,
          });
        }
        if (message.title !== this.state.current_procedure) {
          this.setState({
            current_procedure: message.title,
          });
        }
      }
    });
    this.fetchUserInfo();
  }
  componentDidMount() {
    // 컴포넌트가 마운트 되었을 때 유저 정보 가져오는 함수
    axios
      .get('https://express-server.run.goorm.io/user/getUsers')
      .then((res) => res.data)
      .then((data) => {
        // data.forEach((data) => console.log(data));
        console.log(data);
        this.setState({ users: data });
      });
    this.fetchHistoryHandler();
    // 프로시저 정보 가져오기. (saple1, sample2 ...)
    axios({
      method: 'post',
      url: 'https://express-server.run.goorm.io/procedure/getProcedures',
      data: {},
    })
      .then((response) => {
        this.setState({
          procedures: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    if (this.state.procedure) {
      this.setState({
        portion: parseInt(
          (parseFloat(this.state.current_index) /
            parseFloat(this.state.length)) *
            100,
        ),
      });
    }
  }
  // 유저 정보를 비동기로 가져오는 함수
  async fetchUserInfo() {
    return await axios({
      method: 'post',
      url: 'https://express-server.run.goorm.io/user/userinfo',
      data: {
        idusers: this.state.idusers,
      },
    })
      .then((response) => {
        if (response.data.success) {
          //console.log(response.data);
          const tmp = response.data;
          this.setState({
            name: tmp.name,
            region: tmp.region,
            rank: tmp.rank,
          });
        } else {
          console.log('사용자 정보 가져오기 실패 in Main.js');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 메세지를 보내는 함수
  sendMessage = () => {
    console.log('sendMessage');
    socket.emit('send message from user', {
      id: this.state.idusers,
      message: this.state.messageInput,
    });
    var tmp = this.state.messageHistory.slice(undefined);
    var d = new Date();
    var nowTime =
      d.getFullYear() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getDate() +
      '/' +
      d.getHours() +
      '시' +
      d.getMinutes() +
      '분' +
      d.getSeconds() +
      '초';
    tmp.push(
      <div class="d-flex justify-content-end mb-4">
        <div class="msg_cotainer_send">
          <p>{this.state.messageInput}</p>
          <span class="msg_time_send">{nowTime}</span>
        </div>
      </div>,
    );

    //메시지 비우기, history 업데이트
    this.setState(
      { messageInput: '', messageHistory: tmp },
      this.scrollToBottom,
    );
  };
  // 보낼 메세지 값을 저장하는 함수
  onInputChanged = (event) => {
    this.setState({ messageInput: event.target.value });
  };
  // 과거 측정기록을 가져오는 함수
  fetchHistoryHandler() {
    this.fetchHistory();
  }
  // 과거 측정 기록을 가져오는 함수
  async fetchHistory() {
    return await axios({
      method: 'post',
      url: 'https://express-server.run.goorm.io/history/getHistory',
      data: {
        userId: this.state.idusers,
      },
    })
      .then((response) => {
        var tmp = response.data.slice(undefined);
        console.log(tmp);
        if (tmp) {
          //console.log('hi');
          this.setState({
            history: tmp,
          });
        } else {
          this.setState({
            history: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // 채팅 스크롤을 아래로 내리는 함수
  scrollToBottom = () => {
    this.divRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  // 엔터키 입력시 메시지 전송 함수
  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  };

  render() {
    var procedureStatusList;
    // 현재 진행중인 과정 정보 받기
    if (this.state.current_procedure && this.state.procedures) {
      for (let i = 0; i < this.state.procedures.length; i++) {
        if (this.state.procedures[i].title === this.state.current_procedure) {
          this.state.procedure = this.state.procedures[i];
          break;
        }
      }
    }
    // 진행상황 표시.
    if (this.state.procedure !== null) {
      var tmp = this.state.procedure;
      var vals = tmp.test_vals.split(' ');
      var units = tmp.test_units.split(' ');
      this.state.length = tmp.length;
      procedureStatusList = vals.map((data, index) => {
        if (index === this.state.current_index) {
          return (
            <li
              className="list-group-item list-group-item-secondary"
              key={index}
            >
              <Spinner className="" animation="grow" size="sm" />
              {index + 1 + '.  ' + data + units[index] + ' 측정하기.'}
            </li>
          );
        } else if (index < this.state.current_index) {
          return (
            <li className="list-group-item list-group-item-success" key={index}>
              {index + 1 + '.  ' + data + units[index] + ' 측정하기.'}
            </li>
          );
        } else {
          return (
            <li className="list-group-item " key={index}>
              {index + 1 + '.  ' + data + units[index] + ' 측정하기.'}
            </li>
          );
        }
      });
      if (this.state.current_index === tmp.length) {
        procedureStatusList = <li>{'측정 종료'}</li>;
      }
    } else {
      procedureStatusList = (
        <li>
          <Spinner className="" animation="grow" size="sm" />
          연결중입니다....
        </li>
      );
    }
    return (
      <div className="d-flex flex-column align-items-center " id="User">
        {/* <div id="userInfo">

        </div> */}

        <div
          className="flex-row border border-dark rounded p-1 bg-light mb-4 mt-4"
          id="userInfo"
        >
          <span className="badge badge-secondary">ID</span>
          <span className="form-control mr-3">{this.state.idusers}</span>
          <span className="badge badge-secondary">Admin ID</span>
          <span className="form-control mr-3">
            admin
            <BsCircleFill
              className="d-sm-inline-flex ml-1"
              style={{ color: 'green' }}
            />
          </span>
          <span className="badge badge-secondary">RANK</span>
          <span className="form-control mr-3">{this.state.rank}</span>
          <span className="badge badge-secondary">NAME</span>
          <span className="form-control mr-3">{this.state.name}</span>
          <span className="badge badge-secondary">GROUP</span>
          <span className="form-control mr-5">{this.state.region}</span>

          <button
            className="btn btn-sm btn-dark p-2"
            onClick={this.props.onLogout}
          >
            로그아웃
          </button>

          {/* <div className="d-sm-inline-flex">관리자 접속여부: admin</div> */}
        </div>
        <div
          className="border rounded-lg p-5 bg-light border-dark"
          style={{ width: '1100px' }}
        >
          <div className="d-flex flex-row" id="userPannel">
            {/* LeftPannel */}
            <div className="d-flex flex-column mr-5" id="leftPannel">
              <h1 className="display-4">
                <span className="badge">Progress</span>
                <button
                  className="flex-inline btn-sm p-2 btn btn-dark mr-3 ml-3"
                  type="button"
                  data-toggle="modal"
                  data-target="#history"
                  onClick={this.fetchHistoryHandler}
                >
                  History
                </button>
                <button
                  className="btn-sm p-2 btn btn-dark"
                  type="button"
                  data-toggle="modal"
                  data-target="#manual"
                >
                  Connect Method
                </button>
              </h1>
              <ul className="list-group mt-3">
                <li className="list-group-item list-group-item-success">
                  0. 장비 연결 테스트
                </li>
                {procedureStatusList}
              </ul>
              <HistoryTable
                idusers={this.state.idusers}
                history={this.state.history}
              />
              <Manual className="m-4" id="manual" />
            </div>
            <div className="d-flex flex-column" id="rightPannel">
              <div className="card-body msg_card_body bg-secondary mt-1">
                {this.state.messageHistory}
                <div ref={this.divRef} />
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input
                    className="form-control type_msg"
                    placeholder="Type your message..."
                    value={this.state.messageInput}
                    onChange={this.onInputChanged}
                    onKeyPress={this.onKeyPress}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text send_btn "
                      onClick={this.sendMessage}
                    >
                      send
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
