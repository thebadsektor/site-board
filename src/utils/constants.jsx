import * as THREE from 'three'
import {getCharacterUrls} from './common'


/* Environment */

export const IS_DEV_MODE = false

export const MODEL_TYPE = 'glb'

export const MAX_CHARACTER_CNT = 50

export const REALTIME_DURATION = 10000


/* Static */

export const AXIS_SIZE = 10


export const PLAUSIBLE_STEP_CNT = 3


export const GROUND_SIZE = 3000

export const GROUND_HEIGHT = 2


export const BILLBOARD_URL = './models/fbx/billboard.fbx'

export const BILLBOARD_HTML_SIZE = 1200


export const DEFAULT_LINEAR_DAMPING = 1000

export const LERP_ALPHA = 0.1

export const FLOATING_HEIGHT = 0

export const CHARACTER_COL_CNT = 10

export const CHARACTER_FALL_POS = new THREE.Vector3(0, -10, 0)


/* Dynamic */

export const BACKEND_URL = IS_DEV_MODE ? 'http://127.0.0.1:4000/main' : 'https://mboard-backend.onrender.com/main'

export const HTML_ASPECT = BILLBOARD_HTML_SIZE / 400

export const GRAVITY = 980 * HTML_ASPECT


export const BILLBOARD_SCALE = 0.06 * HTML_ASPECT

export const BILLBOARD_INIT_POS = [0, 0, 12 * HTML_ASPECT]

export const BILLBOARD_DES_POS = BILLBOARD_INIT_POS


export const CHARACTER_URLS = getCharacterUrls(MODEL_TYPE, 5)

export const DEFAULT_ANGULAR_DAMPING = DEFAULT_LINEAR_DAMPING * 10

export const CHARACTER_SCALE = 0.015 * HTML_ASPECT

export const WALKING_SPEED = DEFAULT_LINEAR_DAMPING * 4

export const INIT_ORIGIN_POS = [BILLBOARD_DES_POS[0] + 15, 0, BILLBOARD_DES_POS[2] - (30 * HTML_ASPECT)]

export const VIEW_ORIGIN_POS = [BILLBOARD_DES_POS[0] + 15, 0, BILLBOARD_DES_POS[2]]

export const QUIT_ORIGIN_POS = [BILLBOARD_DES_POS[0] + 40, 0, BILLBOARD_DES_POS[2] - HTML_ASPECT]

export const CHARACTERS_GAP = HTML_ASPECT * 1.6

export const TOLERANCE_DISTANCE = HTML_ASPECT * 10


export const CAMERA_INIT_POS = [-25 * HTML_ASPECT, 25 * HTML_ASPECT, -25 * HTML_ASPECT]

export const CAMERA_DES_POS = CAMERA_INIT_POS
