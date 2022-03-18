(() => {
    window.initFakeMap = (dom, color) => {
        new FakeMap(dom, color)
    }

    const TILE_WIDTH = 150
    const TILE_HEIGHT = 150
    const DEFAULT_COLOR = "#FFD700"
    class FakeMap {
        originX = 0
        originY = 0
        dragStartX = 0
        dragStartY = 0
        dragDiffX = 0
        dragDiffY = 0
        isDragging = false

        constructor(dom, color) {
            this.dom = dom
            if (!!color) {
                this.fillColor = color
            } else {
                this.fillColor = DEFAULT_COLOR
            }
            this.initCanvas()
            requestAnimationFrame(this.onRender.bind(this));
        }

        mouseOffsetX(e) {
            return e.offsetX
        }

        mouseOffsetY(e) {
            return e.offsetY
        }

        fingerOffsetX(e) {
            var rect = e.target.getBoundingClientRect();
            return e.targetTouches[0].clientX - rect.x;
        }

        fingerOffsetY(e) {
            var rect = e.target.getBoundingClientRect();
            return e.targetTouches[0].clientY - rect.y;
        }

        initCanvas() {
            this.canvas = document.createElement("canvas")
            this.canvas.width = this.dom.offsetWidth
            this.canvas.height = this.dom.offsetHeight
            this.dom.appendChild(this.canvas)
            this.canvas.addEventListener("mousedown", this.buildStartMovingCallback(this.mouseOffsetX, this.mouseOffsetY), true)
            this.canvas.addEventListener("mousemove", this.buildMovingCallback(this.mouseOffsetX, this.mouseOffsetY), true)
            document.addEventListener("mouseup", this.buildEndMovingCallback(this.mouseOffsetX, this.mouseOffsetY), true)

            this.canvas.addEventListener("touchstart", this.buildStartMovingCallback(this.fingerOffsetX, this.fingerOffsetY), true)
            this.canvas.addEventListener("touchmove", this.buildMovingCallback(this.fingerOffsetX, this.fingerOffsetY), true)
            document.addEventListener("touchend", (e) => { this.onEndMovingFinger(e) }, true)
        }

        buildStartMovingCallback(funGetOffsetX, funGetOffsetY) {
            return (e) => {
                this.isDragging = true
                this.dragStartX = funGetOffsetX(e)
                this.dragStartY = funGetOffsetY(e)
                this.dragDiffX = 0
                this.dragDiffY = 0
            }
        }

        buildEndMovingCallback(funGetOffsetX, funGetOffsetY) {
            return (e) => {
                if (!this.isDragging) {
                    return
                }
                this.isDragging = false

                // update origin
                this.originX = this.originX + this.dragDiffX
                this.originY = this.originY + this.dragDiffY
                this.dragDiffX = 0
                this.dragDiffY = 0
                let canvasWidth = this.canvas.width
                let canvasHeight = this.canvas.height

                while (this.originX < 0) {
                    this.originX += TILE_WIDTH * 2
                }
                while (this.originX > canvasWidth) {
                    this.originX -= TILE_WIDTH * 2
                }

                while (this.originY < 0) {
                    this.originY += TILE_HEIGHT * 2
                }
                while (this.originY > canvasHeight) {
                    this.originY -= TILE_HEIGHT * 2
                }

                requestAnimationFrame(this.onRender.bind(this));

            }
        }

        buildMovingCallback(funGetOffsetX, funGetOffsetY) {
            return (e) => {
                if (!this.isDragging) {
                    return
                }
                this.dragDiffX = funGetOffsetX(e) - this.dragStartX
                this.dragDiffY = funGetOffsetY(e) - this.dragStartY
                e.preventDefault()
                requestAnimationFrame(this.onRender.bind(this));
            }
        }

        onRender() {
            let ctx = this.canvas.getContext("2d");
            let width = this.canvas.width
            let height = this.canvas.height

            ctx.resetTransform()
            ctx.clearRect(0, 0, width, height)

            ctx.fillStyle = this.fillColor
            let translateX = this.originX + this.dragDiffX
            let translateY = this.originY + this.dragDiffY
            let topLeftX = translateX
            let topLeftY = translateY
            let indexX = 0
            let indexY = 0

            //  A0B0 C0D0
            //      -------- screen
            //  0E0F|0G0H
            //  I0J0|K0L0
            // if "G" is origin, find out (X, Y) of  "C"
            while (topLeftX > 0) {
                topLeftX -= TILE_WIDTH
                indexX -= 1
            }
            while (topLeftY > 0) {
                topLeftY -= TILE_HEIGHT
                indexY -= 1
            }

            let horizontalCount = indexX
            let verticalCount = indexY
            for (let i = topLeftX; i < width; i += TILE_WIDTH) {
                horizontalCount += 1
                verticalCount = indexY
                for (let j = topLeftY; j < height; j += TILE_HEIGHT) {
                    verticalCount++
                    if ((horizontalCount + verticalCount) % 2 == 0) {
                        ctx.fillRect(i, j, TILE_WIDTH, TILE_HEIGHT);
                    }
                }
            }
        }
    }
})()