import React, { Component } from 'react';
import axios from 'axios';
import '../css/RightPannel.css';

class RightPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      user_list: [],
      num: '1',
      title: 'DC',
      contents: [],
      lowValue: [],
      measureValue: '',
      highValue: [],
      result: '',

    };
  }
  componentDidMount() {
    axios
      .get('https://express-server.run.goorm.io/user/getUsers')
      .then((res) => res.data)
      .then((data) => {
        //data.forEach((data) => console.log(data));
        this.setState({ users: data });
      });
  }
  async fetchProcedure() {
    return await axios({
      method: 'post',
      url: 'https://express-server.run.goorm.io/procedure/getProcedures',
      data: {
        num: this.state.num,
      },
    })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          const tmp = response.data;
          this.setState({
            num: tmp.num,
            title: tmp.title,
            contents: tmp.contents,
            lowValue: tmp.lowValue,
            measureValue: tmp.measureValue,
            highValue: tmp.highValue,
            result: tmp.result,
          });
        } else {
          console.log('측정절차 연동 실패 in Main.js');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    var list_items;
    if (this.state.users !== null) {
      list_items = this.state.users.map((data) => (
        <option key={data.idusers}>
          {'ID:' + data.idusers + '  이름:' + data.name}
        </option>
      ));
    }
    return (
      <div
        id="RightPannel"
        className="d-flex flex-column align-items-stretch bg-light border border-secondary"
      >
        <div className="d-flex align-items-start">
          <ul
            className="d-flex flex-row nav nav-tabs"
            id="myTab"
            role="tablist"
          >
            <li className="d-flex nav-item" role="presentation">
              <a
                className="d-flex nav-link active"
                id="profile-tab"
                data-toggle="tab"
                href="#profile"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                작업자
              </a>
            </li>
            <li className="d-flex nav-item" role="presentation">
              <a
                className="nav-link"
                id="home-tab"
                data-toggle="tab"
                href="#home"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                측정절차
              </a>
            </li>

            <li className="d-flex nav-item" role="presentation">
              <a
                className="d-flex nav-link"
                id="info-tab"
                data-toggle="tab"
                href="#info"
                role="tab"
                aria-controls="info"
                aria-selected="false"
              >
                info
              </a>
            </li>
          </ul>
        </div>
        <div
          className="d-flex align-items-stretch tab-content m-3 overflow-auto"
          id="myTabContent"
        >
          <div
            className="tab-pane fade "
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            {/* 여기서 사용한 변수명은 구굴시트에 procedure에 명시 전체 DB에서 가져오게끔 템플릿 필요 */}
            <ul className="list-group">
              <li className="list-group-item">
                <table>
                  <tr>
                    <td>$num</td>
                    <td>$title</td>
                    <td>$contents</td>
                    <td>$lowValue</td>
                    <td>$measurementValue</td>
                    {/* 여기서 measurementValue은 low 와 high와 비교되어야 하며 비교된 값이 result에 
                       PASS / FAIL 표시 */}
                    <td>$highValue</td>
                    <td>$result</td>
                  </tr>
                </table>
              </li>
              <li className="list-group-item">
                <table>
                  <tr>
                    <td>1</td>
                    <td>DC</td>
                    <td>DC 100 V 교정</td>
                    <td>99.998</td>
                    <td>측정된값</td>
                    {/* 여기서 measurementValue은 low 와 high와 비교되어야 하며 비교된 값이 result에 
                       PASS / FAIL 표시 */}
                    <td>100.002</td>
                    <td>pass</td>
                  </tr>
                </table>
              </li>
              <li className="list-group-item">
                <table>
                  <tr>
                    <td>{this.state.num}</td>
                    <td>{this.state.title}</td>
                    <td>{this.state.contents}</td>
                    <td>{this.state.lowValue}</td>
                    <td>{this.state.measureValue}</td>
                    {/* 여기서 measurementValue은 low 와 high와 비교되어야 하며 비교된 값이 result에 
                       PASS / FAIL 표시 */}
                    <td>{this.state.highValue}</td>
                    <td>{this.state.result}</td>
                  </tr>
                </table>
              </li>
              <li className="list-group-item">4. -</li>
              <li className="list-group-item">5. -</li>
            </ul>
          </div>
          <div
            className="tab-pane fade show active "
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <ul className="unstyled-list p1">{list_items}</ul>
          </div>
          <div
            className="tab-pane fade"
            id="info"
            role="tabpanel"
            aria-labelledby="info-tab"
          ></div>
        </div>
      </div>
    );
  }
}

export default RightPannel;
