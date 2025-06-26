import axios from 'axios'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getCredentialData, getCredentialParam } from '../../../src/utils'

class ChatCustomModel implements INode {
    label = 'ChatCustomModel'
    name = 'chatCustomModel'
    version = 1.1
    type = 'ChatCustomModel'
    icon = 'custom.png'
    category = 'Chat Models'
    description = 'Custom chat model that sends requests to your own API'

    credential: INodeParams = {
        label: 'API Key Credential',
        name: 'credential',
        type: 'credential',
        credentialNames: ['customAPI'],
        optional: false
    }

    inputs: INodeParams[] = [
        {
            label: 'API Endpoint',
            name: 'apiUrl',
            type: 'string',
            placeholder: 'http://localhost:5000/chat'
        },
        {
            label: 'Temperature',
            name: 'temperature',
            type: 'number',
            default: 0.7,
            optional: true
        }
    ]

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const apiUrl = nodeData.inputs?.apiUrl as string
        const temperature = nodeData.inputs?.temperature ?? 0.7

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('apiKey', credentialData, nodeData)

        return {
            async call(messages: any) {
                const prompt = messages[messages.length - 1].content

                const res = await axios.post(
                    apiUrl,
                    { prompt, temperature },
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`
                        }
                    }
                )

                return {
                    text: res.data.response || '[No response from API]'
                }
            }
        }
    }
}

module.exports = { nodeClass: ChatCustomModel }
