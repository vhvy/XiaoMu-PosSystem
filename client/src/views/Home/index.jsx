import React from "react";
import { Layout, Popover, Avatar, Button, Modal } from "antd";


function Home({ history }) {

    function test() {
        history.push("/login");
    }

    return (
        <Layout>
            <Button onClick={test}>Login</Button>
        </Layout>
    );
}

export default Home;