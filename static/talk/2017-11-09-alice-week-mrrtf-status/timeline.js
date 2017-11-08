      function drawTimeline() {
                    var container = document.getElementById('timeline');
                    var chart = new google.visualization.Timeline(container);
                    var dataTable = new google.visualization.DataTable();
                    var endDate = new Date(2021,11,15);

                    dataTable.addColumn({ type: 'string', id: 'What' });
                    dataTable.addColumn({ type: 'string', id: 'Event' });
                    // dataTable.addColumn({ type: 'string', role: 'tooltip' });
                    dataTable.addColumn({ type: 'date', id: 'Start' });
                    dataTable.addColumn({ type: 'date', id: 'End' });
                    dataTable.addRows([
                                            [ 'MRRTF', 'init' , new Date(2014,1,15), new Date(2014,3,15)],
                                            [ 'MRRTF','Kickoff meeting ', new Date(2014, 9, 14), new Date(2014,9,16) ],
                                            [ 'MRRTF','1st hackathon',new Date(2016, 2, 8), new Date(2016,2,11) ],
                                            [ 'MRRTF','2nd hackathon',new Date(2016, 9, 18), new Date(2016,9,21) ],
                                            [ 'MRRTF','3rd (virtual only)',new Date(2017, 1, 6), new Date(2017,1,9) ],
                                            [ 'MRRTF','4th hackathon',new Date(2017, 4, 9), new Date(2017,4,12) ],
                                            [ 'MRRTF','5th hackathon',new Date(2017, 6, 5), new Date(2017,6,8) ],
                                            [ 'O2','TDR',new Date(2014, 1, 1), new Date(2015,3,1) ],
                                            [ 'O2','Work packages',new Date(2017, 2, 1), endDate ],
                                            [ 'O2','Simu challenge',new Date(2018, 0, 1), new Date(2018,11,31) ],
                                            [ 'O2','10% data challenge',new Date(2019, 0, 1), new Date(2019,11,31) ],
                                            [ 'O2','Rec+sim (ITS,TPC)',new Date(2017, 1, 1), new Date(2017,11,31) ],
                                            [ 'LHC','LS1',new Date(2013, 1, 16), new Date(2014,11,17) ],
                                            [ 'LHC','LS2',new Date(2018, 11, 31), new Date(2021,0,1) ],
                                            [ 'LHC','Run3 data taking',new Date(2021, 4, 1), endDate ],
                    ]);
            
                    chart.draw(dataTable);
                  }

