const teams = [ /* chatgpt did this, double check*/
    { name: 'Atlanta Hawks', id: '1610612737' },
    { name: 'Boston Celtics', id: '1610612738' },
    { name: 'Brooklyn Nets', id: '1610612751' },
    { name: 'Charlotte Hornets', id: '1610612766' },
    { name: 'Chicago Bulls', id: '1610612741' },
    { name: 'Cleveland Cavaliers', id: '1610612739' },
    { name: 'Dallas Mavericks', id: '1610612742' },
    { name: 'Denver Nuggets', id: '1610612743' },
    { name: 'Detroit Pistons', id: '1610612765' },
    { name: 'Golden State Warriors', id: '1610612744' },
    { name: 'Houston Rockets', id: '1610612745' },
    { name: 'Indiana Pacers', id: '1610612754' },
    { name: 'Los Angeles Clippers', id: '1610612746' },
    { name: 'Los Angeles Lakers', id: '1610612747' },
    { name: 'Memphis Grizzlies', id: '1610612763' },
    { name: 'Miami Heat', id: '1610612748' },
    { name: 'Milwaukee Bucks', id: '1610612749' },
    { name: 'Minnesota Timberwolves', id: '1610612750' },
    { name: 'New Orleans Pelicans', id: '1610612740' },
    { name: 'New York Knicks', id: '1610612752' },
    { name: 'Oklahoma City Thunder', id: '1610612760' },
    { name: 'Orlando Magic', id: '1610612753' },
    { name: 'Philadelphia 76ers', id: '1610612755' },
    { name: 'Phoenix Suns', id: '1610612756' },
    { name: 'Portland Trail Blazers', id: '1610612757' },
    { name: 'Sacramento Kings', id: '1610612758' },
    { name: 'San Antonio Spurs', id: '1610612759' },
    { name: 'Toronto Raptors', id: '1610612761' },
    { name: 'Utah Jazz', id: '1610612762' },
    { name: 'Washington Wizards', id: '1610612764' }
];

import React, { useState } from 'react';
import axios from 'axios';

export function DropdownMenu() {
    const [away, setAway] = useState('');
    const [home, setHome] = useState('');
    const [winner, setWinner] = useState('');
    const [winProb, setWinProb] = useState('');
    const [loading, setLoading] = useState('');

    const handleSelectAway = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setAway(e.target.value);
    };

    const handleSelectHome = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setHome(e.target.value);
    };

    const handleSelectWinner = () => {
        setWinner('');
        setWinProb('');
        setLoading('Loading...');
        if (away.length == 0) {
            setLoading("Select an away team!");
        } else if (home.length == 0) {
            setLoading("Select a home team!")
        }
        console.log('Request sent.');
        axios.post('http://127.0.0.1:5000/api/predict', { away, home })
            .then(response => {
                
                const winnerID = response.data['id'];
                console.log('Winner ID: ' + winnerID);

                const probability = response.data['prob'];
                console.log('Win Probability: ' + probability);

                const winner = teams.find(team => team.id === winnerID);

                setWinner(winner ? winner.name : 'Error');
                setWinProb(probability);
                setLoading('');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <div>
                <select className='top-dropdown' onChange={handleSelectAway}>
                    <option value="">Select the away team...</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <h2 className="at">@</h2>
                <select className="bottom-dropdown" onChange={handleSelectHome}>
                    <option value="">Select the home team...</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
            <button className='predict-button' onClick={handleSelectWinner}>Predict</button>
            {loading && <h3 className='loading'>{loading}</h3>}
            {winner && winProb && <h2 className='winner'>There is a {winProb} chance the {winner} will win.</h2>}
        </div>
    );
}