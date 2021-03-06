'use strict';

import mongoose from 'mongoose';
import { Player, Project } from './../models';

export const player = (app, logger, serviceName) =>
{
    
    // Login or create player
    app.post(`/${serviceName}/api/login`, (req, res) =>
    {
        const { body } = req;
        const { query } = body;

        let jsonData;

        if (query)
        {
            jsonData = JSON.parse(query);
        }
        else
        {
            return res.json({
                success: false
            });
        }

        Player.findOne({ name: jsonData.playerName }, (err, player) =>
        {
            if (player !== null)
            {

                // Login existing player
                Project.findById(new mongoose.Types.ObjectId(jsonData.projectId), (err, project) =>
                {
                    if (project)
                    {
                        if (project.players.indexOf(new mongoose.Types.ObjectId(player._id)) > -1)
                        {
                            return res.json({
                                success: true,
                                data: player
                            });
                        }
                        else
                        {
                            project.players.push(new mongoose.Types.ObjectId(player._id));
                            project.save(() =>
                            {
                                return res.json({
                                    success: true,
                                    data: player
                                });
                            });
                        }
                    }
                });
            }
            else
            {

                // Create new Player
                const newPlayer = new Player();
                newPlayer.name = jsonData.playerName;
                newPlayer.save((err, player) =>
                {
                    Project.findById(new mongoose.Types.ObjectId(jsonData.projectId), (err, project) =>
                    {
                        if (project)
                        {
                            project.players.push(new mongoose.Types.ObjectId(player._id));
                            
                            project.save(() =>
                            {
                                return res.send({
                                    success: true,
                                    data: player
                                });
                            });
                        }
                    });
                });
            }
        });
    });

    // Ping player
    app.post(`/${serviceName}/api/ping`, (req, res) =>
    {
        const { body } = req;
        const { query } = body;

        let jsonData;

        if (query)
        {
            jsonData = JSON.parse(query);
        }
        else
        {
            return res.json({
                success: false
            });
        }

        Player.findOneAndUpdate(
            {
                _id: jsonData.playerId
            },
            {
                $set: {
                    lastUpdate: new Date()
                }
            },
            {
                upsert: false,
                new: false
            },
            (err) =>
            {
                if (err)
                {
                    logger.info(err);
                    return res.send({
                        success: false,
                        message: err
                    });
                }

                return res.send({
                    success: true
                });
            }
        );
    });

    // Get playerinfo by ID
    app.get(`/${serviceName}/api/info/:playerId`, (req, res) =>
    {
        Player.findById(req.params.playerId, (err, player) =>
        {
            if (err)
            {
                logger.error(err);
                return res.send({
                    success: false,
                    message: err
                });
            }

            return res.send({
                success: true,
                data: player
            });
        });
    });

    // Get all players
    app.get(`/${serviceName}/api/all`, (req, res) => 
    {
        Player.find((err, players) => 
        {
            if (err)
            {
                logger.error(err);
                return res.send({
                    success: false,
                    message: err
                });
            }

            logger.info('Getting all players');
            return res.send({
                success: true,
                players
            });
        });
    });
};
