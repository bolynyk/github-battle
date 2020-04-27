import React from 'react';
import {battle} from '../utils/api';
import queryString from 'query-string';
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/all';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


function ProfileList ({ profile }) {
    const {name, location, company, followers, following } = profile;

    return (
        <ul className='card-list'>
            <li>
                <FaUser color='rgb(239, 115, 115)' size={22} />
                {name}
            </li>
            {location && (
                <li>
                    <Tooltip text="User's location" >
                        <FaCompass color='rgb(144, 115, 255)' size={22} />
                        {location}
                    </Tooltip>
                </li>
            )}
            {company && (
                <li>
                    <Tooltip text="User's company">
                        <FaBriefcase color='#795548' size={22} />
                        {company}
                    </Tooltip>
                </li>
            )}
            <li>
                <FaUsers color='rgb(129, 195, 245)' size={22} />
                {followers.toLocaleString()} followers
            </li>
            <li>
                <FaUserFriends color='rgb(64, 183, 95)' size={22} />
                {following.toLocaleString()} following
            </li>
        </ul>
    );
}

ProfileList.propTypes = {
    profile: PropTypes.object.isRequired
}

export default class Results extends React.Component {

    state = {
        winner: null,
        loser: null,
        error: null,
        loading: true
    }

    componentDidMount() {
        const { playerOne, playerTwo } = queryString.parse(this.props.location.search);
        battle([playerOne, playerTwo])
            .then((players) => {
               this.setState({
                   winner: players[0],
                   loser: players[1],
                   error: null,
                   loading: false
               })
            })
            .catch(({ message }) => {
                this.setState({
                    error: message,
                    loading: false
                })
            });
    }

    render() {
        const { winner, loser, error, loading } = this.state;

        if (loading === true) {
            return <Loading />
        } else if (error) {
            return <p className='center-text error'>{error}</p>
        } else {
            const {
                avatar_url: w_avatar_url,
                login: w_login,
                html_url: w_html_url,
            } = winner.profile;

            const {
                avatar_url: l_avatar_url,
                login: l_login,
                html_url: l_html_url,
            } = loser.profile;

            return (
                <React.Fragment>
                    <div className='grid space-around container-sm'>
                        <Card
                            header={winner.score === loser.score ? 'Tie' : 'Winner'}
                            subHeader={`Score: ${winner.score.toLocaleString()}`}
                            avatar={w_avatar_url}
                            href={w_html_url}
                            name={w_login}
                        >
                            <ProfileList profile={winner.profile} />
                        </Card>
                        <Card
                            header={winner.score === loser.score ? 'Tie' : 'Loser'}
                            subHeader={`Score: ${loser.score.toLocaleString()}`}
                            avatar={l_avatar_url}
                            href={l_html_url}
                            name={l_login}
                        >
                            <ProfileList profile={loser.profile} />
                        </Card>
                    </div>
                    <Link
                        className='btn dark-btn btn-space'
                        to='/battle'
                    >
                        Reset
                    </Link>
                </React.Fragment>
            );
        }
    }
}