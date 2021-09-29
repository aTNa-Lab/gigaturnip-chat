import React, {useRef} from "react";
import Chat, {Bubble, useMessages, Input, FileCard, Video} from '@chatui/core';
import {app, storage} from './util/Firebase'

import '@chatui/core/dist/index.css';
import '@chatui/core/es/styles/index.less';
import './icons'
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";


const App = () => {
    const {messages, appendMsg, setTyping} = useMessages([
        {
            type: 'text',
            content: {text: 'Atai Atay'},
            user: {name: 'Atai', avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg'},
            hasTime: true
        },
        {
            type: 'image',
            hasTime: true,
            createdAt: 1630131394,
            content: {url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'}
        },
        {
            type: 'video',
            content: {url: 'https://firebasestorage.googleapis.com/v0/b/atna-lab.appspot.com/o/chat%2Ftest%2F20210710_224155.mp4?alt=media&token=9a514598-d7b5-451f-8f60-799e0608e3fe'}
        },
        {
            type: 'youtube',
            content: {url: 'https://www.youtube.com/embed/1V_xRb0x9aw'}
        },
    ]);

    const handleSend = (type: any, val: any) => {
        if (type === 'text' && val.trim()) {
            appendMsg({
                type: 'text',
                content: {text: val},
                position: 'right',
                user: {name: 'Batai', avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg'},
                hasTime: true,
            });

            setTyping(true);

            setTimeout(() => {
                appendMsg({
                    type: 'text',
                    content: {text: 'Bala bala'},
                    user: {name: 'Batai', avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg'}
                });
            }, 1000);
        }
    };

    const renderMessageContent = (msg: any) => {
        const {type, content} = msg;

        switch (type) {
            case 'text':
                return <Bubble content={content.text}/>;
            case 'image':
                return (
                    <Bubble type="image">
                        <img src={content.url} alt=""/>
                    </Bubble>
                );
            case 'video':
                return (
                    <Bubble type="video">
                        <Video
                            height="480"
                            src={content.url}
                        />
                    </Bubble>
                );
            case 'youtube':
                return (
                    <Bubble type="video">
                        <iframe src={content.url}
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen/>
                    </Bubble>
                );
            case 'file':
                return <FileCard file={content.url}/>;
            default:
                return null;
        }
    };

    const inputFile = useRef(null)

    const handleFileSelect = () => {
        console.log('select file')
        // @ts-ignore
        inputFile.current.click();
    }

    const onChangeFile = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            console.log(file);
            const fileType = file.type.split('/')[0]
            console.log(fileType);
            const storageRef = ref(storage, `chat/test/${file.name}`)
            uploadBytes(storageRef, file).then(async (snapshot) => {
                console.log('Uploaded a blob or file!');
                const url = await getDownloadURL(snapshot.ref)
                console.log(url)
                if (fileType === 'image') {
                    appendMsg({
                        type: 'image',
                        content: {url: url},
                        position: 'right',
                    });
                }
                if (fileType === 'video') {
                    appendMsg({
                        type: 'video',
                        content: {url: url},
                        position: 'right',
                    });
                }
            });
        }
    }

    const handleInputChange = (value: string) => {
        console.log(value)
    };

    const defaultQuickReplies = [
        {
            icon: 'message',
            name: 'Test question 1',
            isNew: true,
            isHighlight: true,
        },
        {
            name: 'Test question 2',
            isNew: true,
        },
        {
            name: 'Test question 3',
            isHighlight: true,
        },
        {
            name: 'Test question 4',
        },
    ];

    const handleQuickReplyClick = (item: any) => {
        handleSend('text', item.name);
    };

    const renderQuickReplies = () => {
        return (
            <List>
                {defaultQuickReplies.map((item) => (
                    <ListItem disablePadding>
                        <ListItemButton sx={{py: 0, minHeight: 32}} onClick={() => handleQuickReplyClick(item)}>
                            <ListItemText
                                primary={item.name}
                                primaryTypographyProps={{fontSize: 14, fontWeight: 'medium'}}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        )
    };

    return (
        <>
            <Chat
                locale="en-US"
                quickReplies={defaultQuickReplies}
                onQuickReplyClick={handleQuickReplyClick}
                renderQuickReplies={renderQuickReplies}
                navbar={{title: 'Assistant'}}
                placeholder={"Text"}
                messages={messages}
                renderMessageContent={renderMessageContent}
                onSend={handleSend}
                onInputChange={handleInputChange}
                rightAction={{icon: "file", onClick: handleFileSelect}}
            />
            <input type='file' id='file' ref={inputFile} onClick={onChangeFile} style={{display: 'none'}}/>
        </>
    );
};

export default App