
import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { RADAR_RANGE } from '../constants';

interface RadarProps {
    player?: Player;
    seeker?: Player;
    isPinging: boolean;
    pingCooldown: number;
    lastPingTime: number;
}

const Radar: React.FC<RadarProps> = ({ player, seeker, isPinging, pingCooldown, lastPingTime }) => {
    const [seekerAngle, setSeekerAngle] = useState<number | null>(null);
    const [seekerDistance, setSeekerDistance] = useState<number>(Infinity);

    const cooldownProgress = Math.min(100, ((Date.now() - lastPingTime) / pingCooldown) * 100);

    useEffect(() => {
        if (isPinging && player && seeker) {
            const dx = seeker.x - player.x;
            const dy = seeker.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= RADAR_RANGE) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                setSeekerAngle(angle);
                setSeekerDistance(distance);
            } else {
                setSeekerAngle(null);
                setSeekerDistance(Infinity);
            }
        } else {
            setSeekerAngle(null);
        }
    }, [isPinging, player, seeker]);

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-bangers text-3xl text-center text-white tracking-wider mb-2">Sneak Radar</h3>
            <div className="w-48 h-48 mx-auto bg-black/50 rounded-full relative border-2 border-orange-500/50 flex items-center justify-center overflow-hidden">
                <div className="absolute w-full h-full border-t border-orange-500/20 animate-spin" style={{animationDuration: '3s'}}></div>
                <div className="w-1/2 h-1/2 bg-orange-500/10 rounded-full"></div>
                {isPinging && seekerAngle !== null && (
                    <div className="absolute w-full h-full" style={{ transform: `rotate(${seekerAngle}deg)` }}>
                        <div className="w-4 h-4 bg-red-500 rounded-full absolute top-1/2 -mt-2 animate-ping" style={{ left: `${(seekerDistance / RADAR_RANGE) * 50}%`}}></div>
                    </div>
                )}
                {isPinging && seekerAngle === null && (
                     <div className="absolute text-orange-400 text-sm">No Signal</div>
                )}
            </div>
             <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">Press [SPACE] to ping</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${cooldownProgress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default Radar;
